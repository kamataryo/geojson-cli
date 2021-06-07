import { isatty } from "tty"
import process from 'process'

export const stdin = () => {

    process.stdin.resume();
    process.stdin.setEncoding("utf8");

    let data = "";

    return new Promise<string>((resolve) => {
        const onEnd = () => { resolve(data) };
        if (isatty(0)) {
            onEnd();
        } else {
            process.stdin.on("data", chunk => (data += chunk));
            process.stdin.on("end", onEnd);
        }
    })

}