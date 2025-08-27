import { PostsProvider } from './context/PostsContext';
import { Feed } from './components/Feed';

function App() {
  return (
    <PostsProvider>
      <Feed />
    </PostsProvider>
  );
}

export default App;
