import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import { ImCoinDollar } from 'react-icons/im';


function LoginPage() {
    const auth = getAuth();

    const { register, handleSubmit, formState: { errors } } = useForm();
    const [errorFromSubmit, setErrorFromSubmit] = useState("")
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        try {
            setLoading(true)

            await signInWithEmailAndPassword(auth, data.email, data.password);

            setLoading(false)
        } catch (error) {
            setErrorFromSubmit(error.message)
            setLoading(false)
            setTimeout(() => {
                setErrorFromSubmit("")
            }, 5000);
        }
    }

    return (
        <div className="auth-wrapper">
            <div style={{ textAlign: 'center' }}>
                <h2 style={{fontSize: '40px',letterSpacing: '10px', color:"#C4B4E1	"}}>
                <ImCoinDollar style={{marginBottom: "10px", marginRight: "25px"}}/>Coin Chat</h2>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label>Email</label>
                <input
                    name="email"
                    type="email"
                    {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
                />
                {errors.email && <p>이메일을 입력해주세요.</p>}

                <label>Password</label>
                <input
                    name="password"
                    type="password"
                    {...register("password", { required: true, minLength: 6 })}
                />
                {errors.password && errors.password.type === "required" && <p>비밀번호를 입력해주세요</p>}
                {errors.password && errors.password.type === "minLength" && <p>비밀번호는 최소 6자 이상입니다.</p>}

                {errorFromSubmit &&
                    <p>{errorFromSubmit}</p>
                }

                <input type="submit" value="로그인" disabled={loading} />
                <Link style={{ color: 'gray', textDecoration: 'none' }} to="/register">아직 아이디가 없으신가요?  </Link>
            </form>
        </div>
    )
}

export default LoginPage
