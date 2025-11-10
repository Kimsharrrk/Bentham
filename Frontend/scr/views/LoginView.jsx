import React, { useEffect } from 'react';

const LoginView = ({ onLoginSuccess, setView }) => {
    useEffect(() => {
        const initializeGoogleSignIn = () => {
            if (window.google && window.google.accounts) {
                window.google.accounts.id.initialize({
                    client_id: "615299012943-6polvojt720aqa5cc0i6cgrjc5bp6ol7.apps.googleusercontent.com",
                    callback: onLoginSuccess
                });
                window.google.accounts.id.renderButton(
                    document.getElementById("google-signin-button"),
                    { theme: "outline", size: "large" }
                );
            }
        };

        if (document.getElementById('google-jssdk')) {
            initializeGoogleSignIn();
        } else {
            const script = document.createElement("script");
            script.id = 'google-jssdk';
            script.src = "https://accounts.google.com/gsi/client";
            script.async = true;
            script.defer = true;
            script.onload = initializeGoogleSignIn;
            document.body.appendChild(script);
        }
    }, [onLoginSuccess]);

    return (
        <main className="flex items-center justify-center py-20">
            <div className="bg-white p-10 rounded-lg shadow-lg text-center">
                <h1 className="text-3xl font-bold mb-4">로그인</h1>
                <p className="text-stone-600 mb-8">SNS 계정으로 간편하게 시작하세요.</p>
                <div id="google-signin-button"></div>
                <button onClick={() => setView('landing')} className="mt-8 text-sm text-stone-500 hover:underline">
                    나중에 할게요
                </button>
            </div>
        </main>
    );
};

export default LoginView;
