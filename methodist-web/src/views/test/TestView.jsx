import {useMemo} from "react";
import FormViewModel from "../../viewmodels/FormViewModel.jsx";
import {observer} from "mobx-react-lite";

function TestView() {
    const formVm = useMemo(() => new FormViewModel(), []);

    return (
        <div>
            <h1>Форма с MobX</h1>
            <div>
                <label>
                    Поле 1:
                    <input
                        type="text"
                        value={formVm.input1}
                        onChange={(e) => formVm.setInput1(e.target.value)}
                    />
                </label>
            </div>
            <div>
                <label>
                    Поле 2:
                    <input
                        type="text"
                        value={formVm.input2}
                        onChange={(e) => formVm.setInput2(e.target.value)}
                    />
                </label>
            </div>
            <button onClick={formVm.submit}>Показать значения</button>
        </div>
    );
}

const ObservedTestView = observer(TestView);
export default ObservedTestView;

