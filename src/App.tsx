import { Provider } from "react-redux";
import AppRotes from "./AppRotes";

import store from "./store/store";

function App() {
  return (
    <>
      <Provider store={store}>
        <AppRotes />
      </Provider>
    </>
  );
}

export default App;
