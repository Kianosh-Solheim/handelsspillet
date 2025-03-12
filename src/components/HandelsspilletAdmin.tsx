import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import confetti from "canvas-confetti";

export default function HandelsspilletAdmin() {
  const [availableCountries] = useState([
    { name: "Norge", type: "A", flag: "https://flagcdn.com/w40/no.png" },
    { name: "USA", type: "A", flag: "https://flagcdn.com/w40/us.png" },
    { name: "Tyskland", type: "A", flag: "https://flagcdn.com/w40/de.png" },
    { name: "Frankrike", type: "A", flag: "https://flagcdn.com/w40/fr.png" },
    { name: "Kina", type: "A", flag: "https://flagcdn.com/w40/cn.png" },
    { name: "Japan", type: "A", flag: "https://flagcdn.com/w40/jp.png" },
    { name: "India", type: "B", flag: "https://flagcdn.com/w40/in.png" },
    { name: "Mexico", type: "B", flag: "https://flagcdn.com/w40/mx.png" },
    { name: "Brasil", type: "B", flag: "https://flagcdn.com/w40/br.png" },
    { name: "Sør-Afrika", type: "B", flag: "https://flagcdn.com/w40/za.png" },
    { name: "Kenya", type: "B", flag: "https://flagcdn.com/w40/ke.png" },
    { name: "Thailand", type: "B", flag: "https://flagcdn.com/w40/th.png" },
    { name: "Tanzania", type: "B", flag: "https://flagcdn.com/w40/tz.png" },
    { name: "Usbekistan", type: "B", flag: "https://flagcdn.com/w40/uz.png" },
    { name: "Kambodsja", type: "B", flag: "https://flagcdn.com/w40/kh.png" },
    { name: "Haiti", type: "C", flag: "https://flagcdn.com/w40/ht.png" },
    { name: "Etiopia", type: "C", flag: "https://flagcdn.com/w40/et.png" },
    { name: "Afghanistan", type: "C", flag: "https://flagcdn.com/w40/af.png" },
    { name: "Somalia", type: "C", flag: "https://flagcdn.com/w40/so.png" },
    { name: "Sudan", type: "C", flag: "https://flagcdn.com/w40/sd.png" },
    { name: "Bangladesh", type: "C", flag: "https://flagcdn.com/w40/bd.png" }
  ]);

  const [selectedCountries, setSelectedCountries] = useState([]);
  const [balances, setBalances] = useState({});
  const [gameStarted, setGameStarted] = useState(false);
  const [showRanking, setShowRanking] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [interestActive, setInterestActive] = useState(false);
  const [interestCountdown, setInterestCountdown] = useState(600);
  const interestRef = useRef(interestActive);

  useEffect(() => {
    interestRef.current = interestActive;
  }, [interestActive]);

  useEffect(() => {
    let timer;
    if (gameStarted) {
      timer = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
        if (interestRef.current) {
          setInterestCountdown((prev) => {
            if (prev <= 1) {
              applyInterest();
              return 600;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted]);

  useEffect(() => {
    if (interestActive && gameStarted) {
      setInterestCountdown(600);
    }
  }, [interestActive, gameStarted]);

  useEffect(() => {
    if (showRanking) {
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 }
      });
    }
  }, [showRanking]);

  const toggleCountrySelection = (country) => {
    setSelectedCountries((prev) =>
      prev.some((c) => c.name === country.name)
        ? prev.filter((c) => c.name !== country.name)
        : [...prev, country]
    );
  };

  const startGame = () => {
    if (selectedCountries.length === 0) {
      alert("Velg minst ett land før du starter spillet.");
      return;
    }
    let initialBalances = {};
    selectedCountries.forEach((country) => {
      initialBalances[country.name] = 0;
    });
    setBalances(initialBalances);
    setElapsedTime(0);
    setInterestCountdown(600);
    setGameStarted(true);
    setShowRanking(false);
  };

  const endGame = () => {
    setGameStarted(false);
    setShowRanking(true);
    const audio = new Audio(
      "https://cdn.pixabay.com/download/audio/2022/03/15/audio_a8ab6bf388.mp3?filename=crowd-cheer-6713.mp3"
    );
    audio.play();
  };

  const resetGame = () => {
    setGameStarted(false);
    setShowRanking(false);
    setSelectedCountries([]);
    setBalances({});
    setElapsedTime(0);
    setInterestCountdown(600);
  };

  const applyInterest = () => {
    setBalances((prev) => {
      let newBalances = { ...prev };
      for (let country of selectedCountries) {
        newBalances[country.name] = Math.round((newBalances[country.name] || 0) * 1.1);
      }
      return newBalances;
    });
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const changeBalance = (countryName, amount) => {
    setBalances((prev) => ({
      ...prev,
      [countryName]: (prev[countryName] || 0) + amount
    }));
  };

  const rankedCountries = [...selectedCountries].sort(
    (a, b) => (balances[b.name] || 0) - (balances[a.name] || 0)
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Handelsspillet - Administrasjon</h1>
      <p className="text-lg">Tid brukt: {formatTime(elapsedTime)}</p>

      {!gameStarted && !showRanking && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {availableCountries.map((country) => (
              <Card
                key={country.name}
                onClick={() => toggleCountrySelection(country)}
                className={
                  selectedCountries.some((c) => c.name === country.name)
                    ? "border-2 border-blue-500"
                    : ""
                }
              >
                <CardContent className="flex items-center space-x-4 p-4">
                  <img
                    src={country.flag}
                    alt={country.name}
                    className="w-10 h-10 rounded-full border border-gray-300 shadow-sm"
                  />
                  <span className="text-lg font-medium">{country.name}</span>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex items-center space-x-4 mt-4">
            <Button onClick={startGame}>Start Spill</Button>
          </div>
        </>
      )}

      {gameStarted && (
        <>
          {interestActive && (
            <p className="text-sm text-gray-600">
              Rente legges til om: {formatTime(interestCountdown)}
            </p>
          )}

          <div className="flex items-center space-x-2 mb-4">
            <input
              type="checkbox"
              checked={interestActive}
              onChange={(e) => setInterestActive(e.target.checked)}
              className="w-4 h-4"
            />
            <span>
              {interestActive
                ? "Rente aktivert – 10% legges til hvert 10. minutt"
                : "Aktiver rente (10% per 10. min)"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {selectedCountries.map((country) => (
              <Card key={country.name} className="p-4 space-y-2">
                <div className="flex items-center space-x-3">
                  <img
                    src={country.flag}
                    alt={country.name}
                    className="w-10 h-10 rounded-full border border-gray-300 shadow-sm"
                  />
                  <span className="text-lg font-medium">{country.name}</span>
                </div>
                <div>Saldo: {balances[country.name]}</div>
                <div className="flex flex-wrap gap-2">
                  {[100, 200, 400, 1000].map((amount) => (
                    <Button
                      key={`plus-${amount}`}
                      onClick={() => changeBalance(country.name, amount)}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      +{amount}
                    </Button>
                  ))}
                  {[100, 200, 400, 1000].map((amount) => (
                    <Button
                      key={`minus-${amount}`}
                      onClick={() => changeBalance(country.name, -amount)}
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      -{amount}
                    </Button>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-4 space-y-4">
            <Button onClick={endGame}>Avslutt Spill</Button>
            <Button variant="outline" onClick={resetGame}>Tilbakestill Spill</Button>
            <div className="pt-10 text-center text-sm text-gray-500">
              Laget av Kianosh F. Solheim for FN-SAMBANDET VEST • Versjon 1.0 • © 2025 • Bergen
            </div>
          </div>
        </>
      )}

      {showRanking && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Resultatliste</h2>
          <ol className="space-y-2">
            {rankedCountries.map((country, index) => (
              <li key={country.name} className="flex items-center space-x-4">
                <span className="text-lg font-bold">
                  {index === 0
                    ? "🥇"
                    : index === 1
                    ? "🥈"
                    : index === 2
                    ? "🥉"
                    : `#${index + 1}`}
                </span>
                <img
                  src={country.flag}
                  alt={country.name}
                  className="w-8 h-8 rounded-full border border-gray-300 shadow-sm"
                />
                <span className="text-md font-medium">{country.name}</span>
                <span className="ml-auto">{balances[country.name]}</span>
              </li>
            ))}
          </ol>
          <Button onClick={resetGame}>Tilbake til start</Button>
          <div className="pt-10 text-center text-sm text-gray-500">
            Laget av Kianosh F. Solheim for FN-SAMBANDET VEST • Versjon 1.0 • © 2025 • Bergen
          </div>
        </div>
      )}
    </div>
  );
}
