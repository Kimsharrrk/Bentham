import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import LandingView from './views/LandingView.jsx';
import LoginView from './views/LoginView.jsx';
import ClosetView from './views/ClosetView.jsx';
import RecommendationView from './views/RecommendationView.jsx';

export default function App() {
    const [view, setView] = useState('landing');
    const [user, setUser] = useState(null);
    const [closetItems, setClosetItems] = useState([]);
    
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const fetchClosetItems = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:8000/api/wardrobe');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setClosetItems(data);
        } catch (error) {
            console.error("Failed to fetch wardrobe items:", error);
        }
    }, []);

    useEffect(() => {
        if (view === 'closet') {
            fetchClosetItems();
        }
    }, [view, fetchClosetItems]);
    
    const handleLoginSuccess = async (credentialResponse) => {
        try {
            const res = await fetch('http://localhost:8000/api/auth/google-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: credentialResponse.credential }),
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('token', data.token);
                setUser(data.user);
                alert(`환영합니다, ${data.user.name}님!`);
                setView('closet');
            } else {
                throw new Error(data.message || 'Login failed');
            }
        } catch (error) {
            console.error("Login Error:", error);
            alert(`로그인 실패: ${error.message}`);
        }
    };
    
    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        alert('로그아웃되었습니다.');
        setView('landing');
    };
    
    const renderView = () => {
        switch (view) {
            case 'closet':
                return <ClosetView items={closetItems} refreshCloset={fetchClosetItems} />;
            case 'recommendation':
                return <RecommendationView />;
            case 'login':
                return <LoginView onLoginSuccess={handleLoginSuccess} setView={setView} />;
            case 'landing':
            default:
                return <LandingView setView={setView} />;
        }
    };

    return (
        <>
            <Header setView={setView} user={user} onLogout={handleLogout} />
            {renderView()}
            <Footer />
        </>
    );
}


