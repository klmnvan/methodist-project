import "./Registration.css"
import {useNavigate} from "react-router-dom";
import {useEffect, useMemo} from "react";
import {RegistrationVM} from "../../viewmodels/RegistrationVM.jsx";
import {observer} from "mobx-react-lite";

function Registration() {
    const formVM = useMemo(() => new RegistrationVM(), [])
    const navigate = useNavigate()

    useEffect(() => {
        formVM.fetchEventForm()
    }, [formVM]);

    return (
        <>
            <div className="background">
                <div className="form-cont">
                    <div className="form">
                        <h1 className="title">Создайте новый аккаунт.</h1>
                        <p>
                            <span className="description">Уже есть аккаунт? </span>
                            <span
                                className="description link"
                                onClick={() => navigate('/auth', { replace: false })}
                            >Авторизуйтесь!</span>
                        </p>
                        <div className="inputAuth">
                            <div>Фамилия</div>
                            <input
                                tabIndex="0"
                                type="text"
                                name="surname"
                                placeholder="Иванов"
                                value={formVM.formData.surname}
                                onChange={formVM.handleChange}
                            />
                        </div>
                        <div className="inputAuth">
                            <div>Имя</div>
                            <input
                                type="text"
                                name="name"
                                placeholder="Иван"
                                value={formVM.formData.name}
                                onChange={formVM.handleChange}
                            />
                        </div>
                        <div className="inputAuth">
                            <div>Отчество</div>
                            <input
                                type="text"
                                name="patronymic"
                                placeholder="Иванович"
                                value={formVM.formData.patronymic}
                                onChange={formVM.handleChange}
                            />
                        </div>
                        <div className="inputAuth">
                            <div>Email</div>
                            <input
                                type="email"
                                name="email"
                                placeholder="user@example.com"
                                value={formVM.formData.email}
                                onChange={formVM.handleChange}
                            />
                        </div>
                        <div className="inputAuth">
                            <div>Пароль</div>
                            <input
                                type="password"
                                name="password"
                                placeholder="******"
                                value={formVM.formData.password}
                                onChange={formVM.handleChange}
                            />
                        </div>
                        <div className="inputAuth">
                            <div>Подтвердите пароль</div>
                            <input
                                type="confirmPassword"
                                name="confirmPassword"
                                placeholder="******"
                                value={formVM.formData.confirmPassword}
                                onChange={formVM.handleChange}
                            />
                        </div>
                        <button className="buttonAuth" onClick={formVM.handleButtonClick}>Создать</button>
                    </div>
                </div>
                <div className="onBoard-cont">
                    <div className="onBoard">
                        <div className="row-image">
                            <button className="button" onClick={formVM.hdlBack}>
                                <svg className="image-in-button" width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 1C1 1 4.36082 2.68041 5.57168 4.66354C6.06486 5.47125 5.99691 6.50294 5.57898 7.35203C4.32972 9.89009 1 11 1 11" stroke="#1977FF" stroke-linecap="round"/>
                                </svg>
                            </button>
                            <img
                                className="image-onBoard"
                                src={formVM.slides[formVM.currentIndex].imageUrl}
                                alt={formVM.slides[formVM.currentIndex].title}
                            />
                            <button className="button" onClick={formVM.hdlNext}>
                                <svg className="image-in-button" width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 1C1 1 4.36082 2.68041 5.57168 4.66354C6.06486 5.47125 5.99691 6.50294 5.57898 7.35203C4.32972 9.89009 1 11 1 11" stroke="#1977FF" stroke-linecap="round"/>
                                </svg>
                            </button>
                        </div>
                        <h3 className="title-onBoard">{formVM.slides[formVM.currentIndex].title}</h3>
                        <h4 className="description-onBoard">{formVM.slides[formVM.currentIndex].description}</h4>
                    </div>
                </div>
            </div>
        </>
    )
}

const ObservedRegistration = observer(Registration);
export default ObservedRegistration