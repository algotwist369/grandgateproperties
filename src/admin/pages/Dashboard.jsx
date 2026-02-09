import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiBuildingLine, RiTeamLine, RiUserLine, RiLineChartLine, RiArrowUpSLine, RiRefreshLine } from 'react-icons/ri';
import { getAdminStats } from '../../apis/user_api';
import { getAllProperties } from '../../apis/property_api';

const Dashboard = () => {
    const { user } = useOutletContext();
    const isAdmin = user?.role === 'admin';

    const [statsData, setStatsData] = useState({ properties: 0, agents: 0, users: 0, sales: "0" });
    const [latestProperties, setLatestProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const fetchedRef = React.useRef(false);

    const fetchData = async () => {
        if (fetchedRef.current) return;
        fetchedRef.current = true;

        setLoading(true);
        setError('');
        try {
            const [stats, propertiesResponse] = await Promise.all([
                getAdminStats(),
                getAllProperties()
            ]);
            setStatsData(stats);

            // For agents, only show their own latest properties if filtered by backend, 
            // but currently getAllProperties returns all. 
            // Let's filter on frontend for now if not admin, but backend should ideally handle it.
            let props = propertiesResponse.properties || [];
            if (!isAdmin) {
                props = props.filter(p => p.createdBy === user?._id);
            }
            setLatestProperties(props.slice(0, 5));
        } catch (err) {
            setError('Failed to fetch dashboard data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const stats = [
        {
            label: isAdmin ? 'Total Properties' : 'My Properties',
            value: statsData.properties,
            icon: <RiBuildingLine />,
            color: 'bg-blue-500',
            trend: '+12%'
        },
        {
            label: isAdmin ? 'Total Agents' : 'Partner Experts',
            value: statsData.agents,
            icon: <RiTeamLine />,
            color: 'bg-[#BD9B5F]',
            trend: '+5%'
        },
        {
            label: isAdmin ? 'Total Users' : 'Qualified Leads',
            value: isAdmin ? statsData.users : 0,
            icon: <RiUserLine />,
            color: 'bg-purple-500',
            trend: '+18%'
        },
        {
            label: isAdmin ? 'Total Sales' : 'My Revenue',
            value: statsData.sales,
            icon: <RiLineChartLine />,
            color: 'bg-green-500',
            trend: '+25%'
        },
    ];

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center py-20">
                <RiRefreshLine size={40} className="text-[#BD9B5F] animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in text-left">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        {isAdmin ? 'Admin' : 'Agent'} <span className="text-[#BD9B5F]">Dashboard</span>
                    </h1>
                    <p className="text-gray-400">
                        {isAdmin ? 'Welcome to your property management command center.' : 'Track your performance and manage your exclusive listings.'}
                    </p>
                </div>
                <button
                    onClick={fetchData}
                    className="p-3 bg-[#1a1a1a] border border-[#333] rounded-2xl text-gray-400 hover:text-[#BD9B5F] transition-all"
                >
                    <RiRefreshLine size={20} />
                </button>
            </div>

            {error && (
                <div className="p-4 bg-red-900/20 border border-red-900/50 rounded-2xl text-red-400 text-sm">
                    {error}
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ y: -5 }}
                        className="p-6 bg-[#1a1a1a] border border-[#333] rounded-3xl relative overflow-hidden group transition-all hover:border-[#BD9B5F]/30"
                    >
                        <div className={`w-12 h-12 ${stat.color}/10 rounded-2xl flex items-center justify-center text-2xl mb-4 transition-colors`}>
                            <span className="text-[#BD9B5F]">{stat.icon}</span>
                        </div>
                        <p className="text-gray-500 text-sm font-medium mb-1">{stat.label}</p>
                        <h3 className="text-3xl font-bold text-white mb-2">{stat.value}</h3>
                        <div className="flex items-center gap-1 text-green-400 text-xs font-bold">
                            <RiArrowUpSLine />
                            <span>{stat.trend}</span>
                            <span className="text-gray-600 font-normal ml-1">vs last month</span>
                        </div>
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                            <span className="text-8xl">{stat.icon}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-[#1a1a1a] border border-[#333] rounded-3xl p-8 min-h-[400px] flex items-center justify-center">
                    <div className="text-center">
                        <RiLineChartLine size={64} className="text-gray-700 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">{isAdmin ? 'Global Performance' : 'My Performance Timeline'}</p>
                        <p className="text-xs text-gray-600 mt-2">Dynamic visualization features coming soon</p>
                    </div>
                </div>
                <div className="bg-[#1a1a1a] border border-[#333] rounded-3xl p-8">
                    <h3 className="text-xl font-bold text-white mb-6">
                        {isAdmin ? 'Latest Properties' : 'My Recent Listings'}
                    </h3>
                    <div className="space-y-6">
                        {latestProperties.length > 0 ? latestProperties.map((prop, i) => (
                            <div key={prop._id || i} className="flex gap-4 items-start focus-within:ring-2 focus-within:ring-[#BD9B5F] rounded-lg p-1 transition-all">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#BD9B5F] mt-2 flex-shrink-0 shadow-[0_0_10px_#BD9B5F]"></div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm text-white font-semibold leading-tight truncate">{prop.title}</p>
                                    <p className="text-xs text-gray-500 mt-1 truncate">{prop.property_category} • {prop.starting_price} {prop.currency}</p>
                                    <p className="text-[10px] text-[#BD9B5F] mt-1 uppercase font-bold tracking-widest">
                                        {new Date(prop.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        )) : (
                            <p className="text-gray-600 text-sm italic">No recent listings found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
