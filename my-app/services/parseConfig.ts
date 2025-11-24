import Parse from "parse/react-native.js";
import AsyncStorage from "@react-native-async-storage/async-storage";


Parse.setAsyncStorage(AsyncStorage);


const PARSE_APPLICATION_ID = "app id";
const PARSE_JAVASCRIPT_KEY = "key js ";

Parse.initialize(PARSE_APPLICATION_ID, PARSE_JAVASCRIPT_KEY);
// URL padrão do Back4App
Parse.serverURL = "https://parseapi.back4app.com/";

export default Parse;