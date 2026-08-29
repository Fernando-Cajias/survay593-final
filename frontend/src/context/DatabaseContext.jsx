import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
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

  // Load from Supabase on mount if configured
  useEffect(() => {
    async function loadSupabaseData() {
      if (!isSupabaseConfigured) return;

      try {
        // Load surveys
        const { data: sData } = await supabase.from('surveys').select('*').order('created_at', { ascending: false });
        if (sData && sData.length > 0) {
          setSurveys(
            sData.map((s) => ({
              id: s.id,
              providerId: s.provider_id,
              title: s.title,
              description: s.description,
              category: s.category,
              status: s.status,
              rewardPerResponse: parseFloat(s.reward_per_response) || 1.0,
              budget: parseFloat(s.budget) || 100,
              spent: parseFloat(s.spent) || 0,
              targetResponses: s.target_responses || 50,
              actualResponses: s.actual_responses || 0,
              estimatedTime: s.estimated_time || 5,
              createdAt: s.created_at,
            }))
          );
        }

        // Load questions
        const { data: qData } = await supabase.from('questions').select('*').order('question_order', { ascending: true });
        if (qData && qData.length > 0) {
          setQuestions(
            qData.map((q) => ({
              id: q.id,
              surveyId: q.survey_id,
              order: q.question_order,
              type: q.type,
              text: q.text,
              required: q.required,
              options: q.options || [],
              scale: q.scale || 5,
              labels: q.labels || [],
            }))
          );
        }

        // Load responses
        const { data: rData } = await supabase.from('responses').select('*').order('completed_at', { ascending: false });
        if (rData && rData.length > 0) {
          setResponses(
            rData.map((r) => ({
              id: r.id,
              surveyId: r.survey_id,
              userId: r.user_id,
              answers: r.answers || {},
              verified: r.verified,
              completedAt: r.completed_at,
            }))
          );
        }

        // Load transactions
        const { data: tData } = await supabase.from('transactions').select('*').order('created_at', { ascending: false });
        if (tData && tData.length > 0) {
          setTransactions(
            tData.map((t) => ({
              id: t.id,
              userId: t.user_id,
              type: t.type,
              amount: parseFloat(t.amount) || 0,
              description: t.description,
              status: t.status,
              createdAt: t.created_at,
            }))
          );
        }

        // Load custom dashboards
        const { data: dData } = await supabase.from('custom_dashboards').select('*').order('created_at', { ascending: false });
        if (dData && dData.length > 0) {
          setCustomDashboards(
            dData.map((d) => ({
              id: d.id,
              providerId: d.provider_id,
              title: d.title,
              description: d.description,
              widgets: d.widgets || [],
              createdAt: d.created_at,
              updatedAt: d.updated_at,
            }))
          );
        }
      } catch (err) {
        console.warn('Could not load data from Supabase, using local state:', err);
      }
    }

    loadSupabaseData();
  }, []);

  // Sync to localStorage as backup
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

  // Operations with Live Supabase Sync
  const addSurvey = async (surveyData, surveyQuestions) => {
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

    if (isSupabaseConfigured) {
      try {
        await supabase.from('surveys').insert([
          {
            id: newSurvey.id,
            provider_id: newSurvey.providerId,
            title: newSurvey.title,
            description: newSurvey.description,
            category: newSurvey.category,
            status: newSurvey.status,
            reward_per_response: newSurvey.rewardPerResponse,
            budget: newSurvey.budget,
            spent: 0,
            target_responses: newSurvey.targetResponses,
            actual_responses: 0,
            estimated_time: newSurvey.estimatedTime,
          },
        ]);

        if (formattedQuestions.length > 0) {
          await supabase.from('questions').insert(
            formattedQuestions.map((q) => ({
              id: q.id,
              survey_id: q.surveyId,
              question_order: q.order,
              type: q.type,
              text: q.text,
              required: q.required,
              options: q.options || [],
              scale: q.scale || null,
              labels: q.labels || [],
            }))
          );
        }
      } catch (err) {
        console.warn('Error creating survey in Supabase:', err);
      }
    }

    return newSurvey;
  };

  const submitResponse = async (surveyId, userId, answers, rewardAmount) => {
    const newResponse = {
      id: `resp_${Date.now().toString(36)}`,
      surveyId,
      userId,
      answers,
      verified: true,
      completedAt: new Date().toISOString(),
    };

    setResponses((prev) => [newResponse, ...prev]);

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

    if (isSupabaseConfigured) {
      try {
        await supabase.from('responses').insert([
          {
            id: newResponse.id,
            survey_id: newResponse.surveyId,
            user_id: newResponse.userId,
            answers: newResponse.answers,
            verified: true,
          },
        ]);

        await supabase.from('transactions').insert([
          {
            id: newTxn.id,
            user_id: newTxn.userId,
            type: newTxn.type,
            amount: newTxn.amount,
            description: newTxn.description,
            status: newTxn.status,
          },
        ]);

        // Increment actual_responses in survey
        const targetSurvey = surveys.find((s) => s.id === surveyId);
        if (targetSurvey) {
          await supabase
            .from('surveys')
            .update({
              actual_responses: (targetSurvey.actualResponses || 0) + 1,
              spent: (targetSurvey.spent || 0) + rewardAmount,
            })
            .eq('id', surveyId);
        }
      } catch (err) {
        console.warn('Error saving response to Supabase:', err);
      }
    }

    return newResponse;
  };

  const requestWithdrawal = async (userId, amount, accountDetails) => {
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

    if (isSupabaseConfigured) {
      try {
        await supabase.from('transactions').insert([
          {
            id: newTxn.id,
            user_id: newTxn.userId,
            type: newTxn.type,
            amount: newTxn.amount,
            description: newTxn.description,
            status: newTxn.status,
          },
        ]);
      } catch (err) {
        console.warn('Error saving withdrawal to Supabase:', err);
      }
    }

    return newTxn;
  };

  const saveCustomDashboard = async (dashboardData) => {
    let savedDash;
    if (dashboardData.id && customDashboards.some((d) => d.id === dashboardData.id)) {
      savedDash = { ...dashboardData, updatedAt: new Date().toISOString() };
      setCustomDashboards((prev) => prev.map((d) => (d.id === dashboardData.id ? savedDash : d)));

      if (isSupabaseConfigured) {
        try {
          await supabase
            .from('custom_dashboards')
            .update({
              title: savedDash.title,
              description: savedDash.description,
              widgets: savedDash.widgets,
              updated_at: new Date().toISOString(),
            })
            .eq('id', savedDash.id);
        } catch (err) {
          console.warn('Error updating dashboard in Supabase:', err);
        }
      }
    } else {
      savedDash = {
        id: dashboardData.id || `dash_${Date.now().toString(36)}`,
        ...dashboardData,
        createdAt: new Date().toISOString(),
      };
      setCustomDashboards((prev) => [savedDash, ...prev]);

      if (isSupabaseConfigured) {
        try {
          await supabase.from('custom_dashboards').insert([
            {
              id: savedDash.id,
              provider_id: savedDash.providerId,
              title: savedDash.title,
              description: savedDash.description,
              widgets: savedDash.widgets,
            },
          ]);
        } catch (err) {
          console.warn('Error saving dashboard to Supabase:', err);
        }
      }
    }
    return savedDash;
  };

  const deleteCustomDashboard = async (id) => {
    setCustomDashboards((prev) => prev.filter((d) => d.id !== id));

    if (isSupabaseConfigured) {
      try {
        await supabase.from('custom_dashboards').delete().eq('id', id);
      } catch (err) {
        console.warn('Error deleting dashboard from Supabase:', err);
      }
    }
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
