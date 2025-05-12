import classes from './SearchInput.module.css';
import {IconSearch} from "@ui/icons/IconSearch.jsx";
import SpacerEM from "@ui/spacers/SpacerEM.jsx";

export default function SearchInput({background, ...props}) {
    return (
        <div
            className={classes.background}
            style={background ? { backgroundColor: background } : {}}
        >
            <div style={{color: "var(--color-outline)"}}>
                <IconSearch/>
            </div>
            <SpacerEM orientation='h' size={1}/>
            <input
                {...props}
                type="text"
                style={background ? { backgroundColor: background } : {}}
            />
        </div>
    )
}