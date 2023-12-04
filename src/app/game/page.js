"use client"

import { useEffect, useState } from 'react';
import { getRandomWord }from '../../lib/gameLogic';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import LottieLoader from 'react-lottie-loader';
import spaceman from '../../assets/spaceman';
import { useRouter } from 'next/navigation';
import StarsCanvas from '@/components/StarBackground';
import Logout from '@/components/Logout';
import { useSupabase } from '@/supabase-provider';


const HangmanGame = () => {
  const router = useRouter();
    const [word, setWord] = useState("")
    const [clue, setClue] = useState("") // New state for the clue
    const [guesses, setGuesses] = useState([])
    const [remaining, setRemaining] = useState(6)
    const [gameOver, setGameOver] = useState(false)
    const [win, setWin] = useState(false)
    const [claimingPrize, setClaimingPrize] = useState(false)
    const [prizeClaimed, setPrizeClaimed] = useState(false)
    const [currentCategory, setCurrentCategory] = useState('Animals');
    const [categories] = useState(['Animals', 'Countries', 'Science', 'SocialStudies']);
    const { width, height } = useWindowSize();
    const [showDropdown, setShowDropdown] = useState(false);
    const { user, supabase } = useSupabase();
    const [score, setScore] = useState(0);

    useEffect(() => {
      resetGame();
  }, [currentCategory]); // Reset game when category changes

  const resetGame = () => {
      const newWordWithClue = getRandomWord(currentCategory);
      setWord(newWordWithClue.word);
      setClue(newWordWithClue.clue);
      setGuesses([]);
      setRemaining(6);
      setGameOver(false);
      setWin(false);
      setClaimingPrize(false);
      setPrizeClaimed(false);
  };
  
  const submitScore = async (currentScore) => {
    if (!user) {
      console.error('User must be logged in to submit a score');
      return;
    }

    const { data, error } = await supabase
      .from('leaderboard')
      .insert([{ user_id: user.id, score: currentScore }]);

    if (error) {
      console.error('Error inserting score:', error);
    } else {
      console.log('Score submitted:', data);
    }
  };
  
  const checkGameOver = () => {
    const hasWon = word.split("").every(letter => guesses.includes(letter) || letter === " ");
    if (hasWon) {
      setWin(true);
      setGameOver(true);
      submitScore(score); // Call submitScore here to submit the score on win
    } else if (remaining <= 0) {
      setGameOver(true);
      setWin(false);
    }
  };
  

  
  const handleGuess = letter => {
    if (!guesses.includes(letter)) {
      setGuesses([...guesses, letter]);
      if (!word.includes(letter) && !gameOver && remaining > 0) {
        setRemaining(remaining - 1);
      }
    }
  
    // Check if the game is over after this guess
    checkGameOver();
  };
  

    useEffect(() => {
      const handleResize = () => {
          if (window.innerWidth < 768) { // Example breakpoint for small screens
              setShowDropdown(true);
          } else {
              setShowDropdown(false);
          }
      };
  
      window.addEventListener('resize', handleResize);
  
      // Initial check
      handleResize();
  
      return () => window.removeEventListener('resize', handleResize);
    }, []);
  
    useEffect(() => {
      const checkForWin = () => {
        // This condition checks all the letters in the word to see if they've been guessed
        const hasWon = word.split("").every(letter => guesses.includes(letter) || letter === " ");
        if (hasWon && word) {
          setWin(true);
          setGameOver(true);
          // Increment the score since the user has won
          setScore(prevScore => prevScore + 10); // Add points for a win
        } else if (remaining <= 0) {
          setGameOver(true);
          setWin(false);
        }
      };
    
      checkForWin();
    }, [guesses, remaining, word]);
    
    // New useEffect to handle score submission separately
    useEffect(() => {
      // If the game is over and the user has won, submit the score
      if (gameOver && win) {
        submitScore(score);
      }
    }, [gameOver, win, score, submitScore]);
    
  
  
    return (
      <>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", height: "130vh", color: "white", overflowY: 'auto' }}>
            <StarsCanvas/>
            <div style={{ position: "fixed", top: 0, width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 200, padding: '10px' }}>
                <div style={{ display: showDropdown ? 'none' : 'block' }}>
                    {categories.map((category) => (
                        <button key={category} onClick={() => setCurrentCategory(category)} style={{ background: "transparent", border: "none", color: "white", padding: "10px", cursor: "pointer" }}>
                            {category}
                        </button>
                    ))}
                </div>
                <div style={{ display: showDropdown ? 'block' : 'none' }}>
                    <select onChange={(e) => setCurrentCategory(e.target.value)} value={currentCategory} style={{ background: "black", color: "white", padding: "10px", cursor: "pointer" }}>
                        {categories.map((category) => (
                            <option key={category} value={category} style={{ background: "black", color: "white" }}>{category}</option>
                        ))}
                    </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <button onClick={() => router.push('/leaderboard')} style={{ background: "green", border: "none", color: "white", padding: "10px", cursor: "pointer", borderRadius: '5px', marginRight: '10px' }}>
                        View Leaderboard
                    </button>
                    <Logout supabase={supabase} />
                </div>
            </div>
   
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          height: "100vh",
          marginTop: "30px",
          color:"white"
         
        }}
      >
                 <LottieLoader animationData={spaceman} style={{ height: "200px" }} />
          <h3 style={{ marginBottom:"1rem"}}>Good Luck</h3>
    
       
            <div
              style={{
                marginBottom: "2rem"
              }}
            >
              <p
                style={{
                  fontSize: "3rem",
                  fontWeight: "bold",
                  letterSpacing: "0.5rem",
                  padding: "1rem",
                  backgroundColor: "#007bff",
                  borderRadius: "10px",
                }}
              >
                {word
                  .split("")
                  .map(letter => (guesses.includes(letter) ? letter : "_"))
                  .join(" ")}
              </p>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                marginBottom: "2rem"
              }}
            >
              <h3>Clue: {clue}</h3>
              <br />
              <h3>Guesses:</h3>
              <p
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold"
                }}
              >
                {guesses.join(", ")}
              </p>
            </div>
  
            <p
              style={{
                fontSize: "1.25rem",
                fontWeight: "bold",
                marginBottom: "2rem"
              }}
            >
              Remaining Guesses: {remaining}
            </p>
            <div
              style={{
                maxWidth: "600px",
                textAlign: "center"
              }}
            >
              {"abcdefghijklmnopqrstuvwxyz".split("").map(letter => (
                <button
                  key={letter}
                  onClick={() => handleGuess(letter)}
                  disabled={guesses.includes(letter) || gameOver}
                  style={{
                    border: "1px solid #ccc",
                    padding: "0.5rem 1rem",
                    borderRadius: "4px",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    margin: "0.5rem",
                    minWidth: "40px",
                    zIndex:"10",
                    pointerEvents: 'auto',
                    position:"relative"
                  
                  }}
                >
                  {letter}
                </button>
              ))}
            </div>
            {gameOver && win && <Confetti width={width} height={height} />}
            {gameOver && (
              <div
                style={{
                  position: "absolute",
                  height: "100vh",
                  width: "100vw",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  backdropFilter: "blur(5px)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 100,
                  color: "#fff"
                }}
              >
                <div
                  style={{
                    padding: "2rem",
                    backgroundColor: "#333",
                    borderRadius: "10px",
                    textAlign: "center"
                  }}
                >
                  <h3>
                   {win ? "Congratulations! You won!" : "Game Over! Try again."}
                    {win && <Confetti width={width} height={height} />}
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                
  
                    <button
                      onClick={resetGame}
                      style={{
                        border: "1px solid #ccc",
                        padding: "0.5rem 1rem",
                        borderRadius: "4px",
                        fontSize: "0.8rem",
                        cursor: "pointer",
                        margin: "0.5rem",
                        width: "100%"
                      }}
                    >
                      Restart Game
                    </button>
                  </div>
                </div>
              </div>
            )}
      </div>
      </div>
      
      </> 
    )
  }
  
  export default HangmanGame;
