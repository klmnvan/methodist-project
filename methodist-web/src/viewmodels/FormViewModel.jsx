import {makeAutoObservable} from "mobx";

class TestViewModel {
    input1 = "";
    input2 = "";

    constructor() {
        makeAutoObservable(this);
    }

    setInput1 = (value) => {
        this.input1 = value;
    };

    setInput2 = (value) => {
        this.input2 = value;
    };

    submit = () => {
        alert(`Input 1: ${this.input1}\nInput 2: ${this.input2}`);
    };
}

export default TestViewModel;