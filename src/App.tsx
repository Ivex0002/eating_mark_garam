import './App.css'
import Background from './components/BackGround'
import Header from './components/Header';
import MyPlaces from './components/MyPlaces';
import NearPlaces from './components/NearPlaces';

function App() {

  return (
    <Background>
      <Header />
      <MyPlaces />
      <NearPlaces />
    </Background>
  );
}

export default App
