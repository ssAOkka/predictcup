import { useEffect, useState } from 'react';
import { matchService, Match } from '@/services/match.service';
import { predictionService } from '@/services/prediction.service';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface PredictionForm {
  homeScore: number | null;
  awayScore: number | null;
  result: 'home' | 'draw' | 'away' | null;
}

export const HomePage = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<Record<string, PredictionForm>>({});
  const [submittedMatches, setSubmittedMatches] = useState<Set<string>>(new Set());
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchMatches();
  }, [isAuthenticated, navigate]);

  const fetchMatches = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await matchService.getUpcomingMatches();
      setMatches(data);
    } catch (err) {
      setError('Failed to load matches. Please refresh the page.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePredictionChange = (
    matchId: string,
    field: keyof PredictionForm,
    value: any
  ) => {
    setPredictions(prev => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [field]: value,
      },
    }));
  };

  const handleSubmitPrediction = async (matchId: string) => {
    const pred = predictions[matchId];
    if (!pred || pred.homeScore === null || pred.awayScore === null || !pred.result) {
      setError('Please fill in all prediction fields');
      return;
    }

    setSubmittingId(matchId);
    setError('');
    setSuccess('');

    try {
      await predictionService.createPrediction({
        matchId,
        predictedHomeScore: pred.homeScore,
        predictedAwayScore: pred.awayScore,
        predictedResult: pred.result,
      });
      setSuccess('Prediction submitted successfully!');
      setPredictions(prev => {
        const newPred = { ...prev };
        delete newPred[matchId];
        return newPred;
      });
      setSubmittedMatches(prev => new Set([...prev, matchId]));
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit prediction');
    } finally {
      setSubmittingId(null);
    }
  };

  const formatMatchDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">⚽</span>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">World Cup Predictions</h1>
              <p className="text-gray-600 mt-1">Make your predictions for the FIFA World Cup matches</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-8 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
            <p className="text-sm text-green-700 font-medium">{success}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent mb-4"></div>
              <p className="text-gray-600 font-medium">Loading matches...</p>
            </div>
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <p className="text-gray-600 text-lg font-medium">⏳ No upcoming matches at the moment</p>
            <p className="text-gray-500 text-sm mt-2">Check back soon for World Cup fixtures</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {matches.map((match) => (
              <div
                key={match.id}
                className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border-t-4 ${
                  submittedMatches.has(match.id) ? 'border-t-green-500 bg-green-50' : 'border-t-emerald-600'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="text-sm font-medium text-gray-500">
                    {formatMatchDate(match.matchDate)}
                  </div>
                  {submittedMatches.has(match.id) && (
                    <div className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                      ✓ Submitted
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-center gap-2 sm:gap-4">
                    <div className="flex-1 text-center">
                      <div className="font-bold text-gray-900 text-lg">
                        {match.homeTeam}
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-300 text-center">vs</div>
                    <div className="flex-1 text-center">
                      <div className="font-bold text-gray-900 text-lg">
                        {match.awayTeam}
                      </div>
                    </div>
                  </div>
                </div>

                {!submittedMatches.has(match.id) && (
                  <>
                    <div className="space-y-4 mb-6">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">
                            {match.homeTeam} Goals
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="10"
                            value={predictions[match.id]?.homeScore ?? ''}
                            onChange={(e) =>
                              handlePredictionChange(
                                match.id,
                                'homeScore',
                                e.target.value ? parseInt(e.target.value) : null
                              )
                            }
                            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-center font-bold text-lg"
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">
                            {match.awayTeam} Goals
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="10"
                            value={predictions[match.id]?.awayScore ?? ''}
                            onChange={(e) =>
                              handlePredictionChange(
                                match.id,
                                'awayScore',
                                e.target.value ? parseInt(e.target.value) : null
                              )
                            }
                            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-center font-bold text-lg"
                            placeholder="0"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-2">
                          Match Result
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { value: 'home' as const, label: match.homeTeam, emoji: '🏠' },
                            { value: 'draw' as const, label: 'Draw', emoji: '🤝' },
                            { value: 'away' as const, label: match.awayTeam, emoji: '🎯' },
                          ].map((result) => (
                            <button
                              key={result.value}
                              onClick={() =>
                                handlePredictionChange(match.id, 'result', result.value)
                              }
                              className={`py-3 rounded-lg font-bold transition-all border-2 text-sm ${
                                predictions[match.id]?.result === result.value
                                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg'
                                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:border-emerald-600 hover:bg-emerald-50'
                              }`}
                            >
                              <div>{result.emoji}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSubmitPrediction(match.id)}
                      disabled={submittingId === match.id}
                      className="w-full py-3 bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-bold rounded-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                    >
                      {submittingId === match.id ? 'Submitting...' : 'Submit Prediction'}
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
