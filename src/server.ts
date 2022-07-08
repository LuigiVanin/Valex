import app from "./app";
import "./config/setup";

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`I am listen do port ${PORT}`);
});
