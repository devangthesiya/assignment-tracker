import { PostsProvider } from './context/PostsContext';
import { ThemeProvider } from './context/ThemeContext';
import { Feed } from './components/Feed';

function App() {
  return (
    <ThemeProvider>
      <PostsProvider>
        <Feed />
      </PostsProvider>
    </ThemeProvider>
  );
}

export default App;
