interface StartupScreenProps {
    onStart: () => void
}


export const ScreenIntro: React.FC<StartupScreenProps> = ({ onStart }) => {
    return (
        <div
            onClick={onStart}
            onTouchStart={onStart} // ensures touch devices also trigger start
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                width: '100vw',
                background: 'linear-gradient(to bottom, #1e3c72, #2a5298)',
                color: '#fff',
                textAlign: 'center',
                fontFamily: 'Arial, sans-serif',
                cursor: 'pointer', // shows user can click anywhere
            }}
        >
            <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>
                Update Conference Flight
            </h1>
            <button
                style={{
                    padding: '1.5rem 3rem',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: '#ff5722',
                    color: '#fff',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                }}
            >
                Start the Game
            </button>
        </div>
    )
}
