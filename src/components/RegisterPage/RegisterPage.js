import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import md5 from 'md5';
// import firebase from '../../firebase';
import { getDatabase, ref, set } from "firebase/database";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

function RegisterPage() {

    const { register, watch, formState: { errors }, handleSubmit } = useForm();
    const [errorFromSubmit, setErrorFromSubmit] = useState("")
    const [loading, setLoading] = useState(false);

    const password = useRef();
    password.current = watch("password");

    const onSubmit = async(data)=>{

      try{
        setLoading(true)
        const auth = getAuth();
        let createdUser = await createUserWithEmailAndPassword(auth, data.email, data.password)
        console.log('createdUser', createdUser)
        console.log('createdUser', data.password)

        await updateProfile(auth.currentUser, {
          displayName: data.name,
          photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
      })


      //데이터베이스에 저장하는 코드
      set(ref(getDatabase(), `users/${createdUser.user.uid}`), {
        name: createdUser.user.displayName,
        password: data.password,
        email: data.email,
        image: createdUser.user.photoURL

      })
        setLoading(false)
      } catch(error){
        setErrorFromSubmit(error.message)
        setLoading(false)
        setTimeout(()=>{
          setErrorFromSubmit("")
        }, 5000)
      }
      
    }



  return (
    <div className="auth-wrapper">

      <div style={{textAlign: 'center'}}>
        <h2 style={{fontSize: '40px',letterSpacing: '10px', color:"#C4B4E1"}}>회원가입</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
          <label>Email</label>
           <input
              name="email"
              type="email"
              {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
           />
           {errors.email && <p>이메일을 입력해주세요.</p>}

           <label>Name</label>
            <input
              name="name"
              {...register("name", { required: true, maxLength: 10 })}
            />
            {errors.name && errors.name.type === "required" && <p>사용할 닉네임을 입력해주세요.</p>}
            {errors.name && errors.name.type === "maxLength" && <p>닉네임은 최대 10글자 이하로 해주세요.</p>}

            <label>Password</label>
              <input
                name="password"
                type="password"
                {...register("password", { required: true, minLength: 6 })}
            />
            {errors.password && errors.password.type === "required" && <p>사용할 비밀번호를 입력해주세요.</p>}
            {errors.password && errors.password.type === "minLength" && <p>비밀번호는 최소 6자 이상입니다.</p>}

        <label>Password Confirm</label>
        <input
          name="password_confirm"
          type="password"
          {...register("password_confirm", {
            required: true,
            validate: (value) =>
                value === password.current
        })}
        />
        {errors.password_confirm && errors.password_confirm.type === "required" && <p>비밀번호를 다시 한 번 입력해주세요.</p>}
        {errors.password_confirm && errors.password_confirm.type === "validate" && <p>올바르지 않은 비밀번호입니다.</p>}


        {errorFromSubmit &&
                    <p>{errorFromSubmit}</p>
                }

        <input type="submit" value="회원가입" disabled={loading}/>
        <Link style={{color: 'gray', textDecoration: 'none'}} to="/login" >이미 아이디가 있으신가요?</Link>
      </form>

    </div>
  )
}

export default RegisterPage