import Parse from "parse/react-native.js";
import AsyncStorage from "@react-native-async-storage/async-storage";


Parse.setAsyncStorage(AsyncStorage);


const PARSE_APPLICATION_ID = "tWqOrszO8fAm6ZiUKzw6KTpikRGqtlNjiDDe7ORN";
const PARSE_JAVASCRIPT_KEY = "MYXogIlx9NAV4Fe7aj3FC4hxAM8l5mnDD4cBwYtV";

Parse.initialize(PARSE_APPLICATION_ID, PARSE_JAVASCRIPT_KEY);
// URL padrão do Back4App
Parse.serverURL = "https://parseapi.back4app.com/";

export default Parse;