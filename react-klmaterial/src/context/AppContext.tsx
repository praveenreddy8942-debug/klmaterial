import { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface UserPreferences {
  theme: 'dark' | 'light';
  reducedMotion: boolean;
  fontSize: 'sm' | 'md' | 'lg';
  showAnimations: boolean;
}

interface AppContextType {
  preferences: UserPreferences;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  searchHistory: string[];
  addToSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultPreferences: UserPreferences = {
  theme: 'dark',
  reducedMotion: false,
  fontSize: 'md',
  showAnimations: true,
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [preferences, setPreferences] = useLocalStorage<UserPreferences>(
    'app-preferences',
    defaultPreferences
  );

  const [searchHistory, setSearchHistory] = useLocalStorage<string[]>('search-history', []);

  const [favorites, setFavorites] = useLocalStorage<string[]>('favorites', []);

  const updatePreferences = (prefs: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...prefs }));
  };

  const addToSearchHistory = (query: string) => {
    if (!query.trim()) return;
    
    setSearchHistory((prev) => {
      const filtered = prev.filter((item) => item !== query);
      return [query, ...filtered].slice(0, 10); // Keep last 10 searches
    });
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      return [...prev, id];
    });
  };

  const value: AppContextType = {
    preferences,
    updatePreferences,
    searchHistory,
    addToSearchHistory,
    clearSearchHistory,
    favorites,
    toggleFavorite,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
