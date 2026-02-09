import React, { useState, useEffect } from 'react';
import AgentHeaders from '../../components/agents/AgentHeaders';
import AgentCard from '../../components/agents/AgentCard';
import { getAllAgents } from '../../apis/agent_api';

const AgentsPage = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isFetched = React.useRef(false);

  useEffect(() => {
    if (isFetched.current) return;
    isFetched.current = true;

    const fetchAgents = async () => {
      try {
        setLoading(true);
        const data = await getAllAgents();
        // data.agents contains the array from our API
        setAgents(data.agents || []);
      } catch (err) {
        console.error('Failed to fetch agents:', err);
        setError('Failed to load our expert team. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  return (
    <div className="bg-black min-h-screen">
      <AgentHeaders />
      {error && (
        <div className="py-10 text-center text-red-500 uppercase tracking-widest text-xs">
          {error}
        </div>
      )}
      <AgentCard agents={agents} loading={loading} />
    </div>
  );
}

export default AgentsPage;