import './Auth.css'

import {useTheme} from "../../providers/MethodistThemeProvider.jsx";

function Auth() {
    const { switchTheme } = useTheme();

    return(
        <>
            <div className="background-cont">
                <span>Приветикиdd!</span>
                <button onClick={ switchTheme }>Switch Theme</button>
            </div>
        </>
    )
}

export default Auth