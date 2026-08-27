import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_SURVEYS,
  INITIAL_QUESTIONS,
  INITIAL_RESPONSES,
  INITIAL_TRANSACTIONS,
  INITIAL_CUSTOM_DASHBOARDS,
} from '../services/seedData';

const DatabaseContext = createContext(null);
const DB_STORAGE_PREFIX = 'survey593_react_';

export const DatabaseProvider = ({ children }) => {
  const [surveys, setSurveys] = useState(() => {
    const saved = localStorage.getItem(`${DB_STORAGE_PREFIX}surveys`);
    return saved ? JSON.parse(saved) : INITIAL_SURVEYS;
  });

  const [questions, setQuestions] = useState(() => {
    const saved = localStorage.getItem(`${DB_STORAGE_PREFIX}questions`);
    return saved ? JSON.parse(saved) : INITIAL_QUESTIONS;
  });

  const [responses, setResponses] = useState(() => {
    const saved = localStorage.getItem(`${DB_STORAGE_PREFIX}responses`);
    return saved ? JSON.parse(saved) : INITIAL_RESPONSES;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem(`${DB_STORAGE_PREFIX}transactions`);
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [customDashboards, setCustomDashboards] = useState(() => {
    const saved = localStorage.getItem(`${DB_STORAGE_PREFIX}dashboards`);
    return saved ? JSON.parse(saved) : INITIAL_CUSTOM_DASHBOARDS;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${DB_STORAGE_PREFIX}surveys`, JSON.stringify(surveys));
  }, [surveys]);

  useEffect(() => {
    localStorage.setItem(`${DB_STORAGE_PREFIX}questions`, JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem(`${DB_STORAGE_PREFIX}responses`, JSON.stringify(responses));
  }, [responses]);

  useEffect(() => {
    localStorage.setItem(`${DB_STORAGE_PREFIX}transactions`, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(`${DB_STORAGE_PREFIX}dashboards`, JSON.stringify(customDashboards));
  }, [customDashboards]);

  // Operations
  const addSurvey = (surveyData, surveyQuestions) => {
    const newSurveyId = `surv_${Date.now().toString(36)}`;
    const newSurvey = {
      id: newSurveyId,
      ...surveyData,
      actualResponses: 0,
      spent: 0,
      createdAt: new Date().toISOString(),
    };

    const formattedQuestions = surveyQuestions.map((q, idx) => ({
      id: `q_${newSurveyId}_${idx + 1}`,
      surveyId: newSurveyId,
      order: idx + 1,
      ...q,
    }));

    setSurveys((prev) => [newSurvey, ...prev]);
    setQuestions((prev) => [...prev, ...formattedQuestions]);
    return newSurvey;
  };

  const submitResponse = (surveyId, userId, answers, rewardAmount) => {
    const newResponse = {
      id: `resp_${Date.now().toString(36)}`,
      surveyId,
      userId,
      answers,
      verified: true,
      completedAt: new Date().toISOString(),
    };

    setResponses((prev) => [newResponse, ...prev]);

    // Update survey responses & spent
    setSurveys((prev) =>
      prev.map((s) =>
        s.id === surveyId
          ? {
              ...s,
              actualResponses: (s.actualResponses || 0) + 1,
              spent: (s.spent || 0) + rewardAmount,
            }
          : s
      )
    );

    // Register income transaction
    const newTxn = {
      id: `txn_${Date.now().toString(36)}`,
      userId,
      type: 'income',
      amount: rewardAmount,
      description: `Encuesta completada: ${surveys.find((s) => s.id === surveyId)?.title || ''}`,
      status: 'completed',
      createdAt: new Date().toISOString(),
    };

    setTransactions((prev) => [newTxn, ...prev]);
    return newResponse;
  };

  const requestWithdrawal = (userId, amount, accountDetails) => {
    const newTxn = {
      id: `txn_${Date.now().toString(36)}`,
      userId,
      type: 'withdrawal',
      amount: -Math.abs(amount),
      description: `Retiro a cuenta ${accountDetails || 'bancaria'}`,
      status: 'completed',
      createdAt: new Date().toISOString(),
    };

    setTransactions((prev) => [newTxn, ...prev]);
    return newTxn;
  };

  const saveCustomDashboard = (dashboardData) => {
    if (dashboardData.id && customDashboards.some((d) => d.id === dashboardData.id)) {
      setCustomDashboards((prev) =>
        prev.map((d) => (d.id === dashboardData.id ? { ...dashboardData, updatedAt: new Date().toISOString() } : d))
      );
      return dashboardData;
    } else {
      const newDash = {
        id: dashboardData.id || `dash_${Date.now().toString(36)}`,
        ...dashboardData,
        createdAt: new Date().toISOString(),
      };
      setCustomDashboards((prev) => [newDash, ...prev]);
      return newDash;
    }
  };

  const deleteCustomDashboard = (id) => {
    setCustomDashboards((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <DatabaseContext.Provider
      value={{
        surveys,
        questions,
        responses,
        transactions,
        customDashboards,
        addSurvey,
        submitResponse,
        requestWithdrawal,
        saveCustomDashboard,
        deleteCustomDashboard,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) throw new Error('useDatabase must be used within a DatabaseProvider');
  return context;
};
