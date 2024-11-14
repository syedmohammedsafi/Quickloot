import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";
import { ref, uploadBytes } from "firebase/storage";
import { Timestamp, addDoc, collection, query, where, getDocs, updateDoc, increment, setDoc, doc, arrayUnion, getDoc } from 'firebase/firestore';
import { auth, db, storage } from "../firebase/Firebase";
import logo from "../assets/logo.ico";
import { useUser } from "../context/UserContext";
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';

function Signup() {
  const { userEmail, setUserEmail } = useUser();
  const { referCode: referCodeFromParams } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [loader, setLoader] = useState(false);
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [referCode, setReferCode] = useState("");

  useEffect(() => {
    if (referCodeFromParams) {
      setReferCode(referCodeFromParams);
    }
  }, [referCodeFromParams]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email || "");
        navigate('/dashboard', { replace: true });
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoader(true);
    if (!validateEmail(email)) {
      setError("Invalid email");
      setLoader(false);
      return;
    }
    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 digit, and 1 special character"
      );
      setLoader(false);
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = {
        name,
        uid: userCredential.user.uid,
        email,
        mobile: phone,
        country,
        time: Timestamp.now(),
        balance: 0,
        recharge: 0,
        withdrawal: 0,
        referrals: 0,
        refercode: referCode,
        referralCode: userCredential.user.uid.slice(0, 5),
      };

      await addDoc(collection(db, "users"), newUser);
      if (referCode) {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("referralCode", "==", referCode));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (doc) => {
          await updateDoc(doc.ref, {
            referrals: increment(1)
          });
        });
      }

      if (referCode) {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("referralCode", "==", referCode));
        const querySnapshot = await getDocs(q);

        for (const userDoc of querySnapshot.docs) {
          const userEmail = userDoc.data().email;
          if (userEmail) {
            const docRef = doc(db, 'ReferralList', userEmail);

            const docSnap = await getDoc(docRef);
            if (!docSnap.exists()) {
              await setDoc(docRef, {
                myreferrals: [email]
              });
            } else {
              await updateDoc(docRef, {
                myreferrals: arrayUnion(email)
              });
            }
          }
        }
      }

      const placeholderRef = ref(storage, `${userCredential.user.uid}/.placeholder`);
      const emptyBlob = new Blob([]);
      await uploadBytes(placeholderRef, emptyBlob);

      navigate("/login");
    } catch (err: any) {
      setError(err.message);
    }
    setLoader(false);
  };

  const handleGoogleLogin = async () => {
    setLoader(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const userData = {
        name: result.user.displayName || "",
        uid: result.user.uid,
        email: result.user.email,
        mobile: result.user.phoneNumber || "",
        country: country || "Not specified",
        time: Timestamp.now(),
        balance: 0,
        recharge: 0,
        withdrawal: 0,
        referrals: 0,
        refercode: referCode,
        referralCode: result.user.uid.slice(0, 5),
      };

      await addDoc(collection(db, "users"), userData);
      localStorage.setItem("token", await result.user.getIdToken());
      const placeholderRef = ref(storage, `${result.user.uid}/.placeholder`);
      const emptyBlob = new Blob([]);
      await uploadBytes(placeholderRef, emptyBlob);
      navigate("/dashboard");
    } catch (error: any) {
      setError(error.message);
    }
    setLoader(false);
  };

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validatePassword = (password: string) => {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;
    return re.test(password);
  };

  const [open, setOpen] = useState(false);

  const toggle = () => {
    setOpen(!open);
  }

  return (
    <>
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <img src={logo} className="w-10 h-10" alt="" />
          <a className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
            Quickloot
          </a>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign up to your account
              </h1>
              <form className="space-y-4 md:space-y-6" action="#">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@gmail.com"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={(open === false) ? 'password' : 'text'}
                      name="password"
                      id="password"
                      placeholder="Ex: (Abcde123@)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                    {error && <span className="mt-10 text-red-600">{error}</span>}
                    <div className="text-2xl absolute top-1/2 transform -translate-y-1/2 right-4 md:right-6 lg:right-8">
                      {(open === false) ? <AiFillEyeInvisible onClick={toggle} className="text-gray-400" /> : <AiFillEye onClick={toggle} className="text-gray-400" />}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-600 font-bold">Country</label>
                  <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300">
                    <option value="">Select Country</option>
                    <option value="India">India</option>
                    <option value="Pakistan">Pakistan</option>
                    <option value="United States">United States</option>
                    <option value="Bangladesh">Bangladesh</option>
                    <option value="China">China</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                    <option value="Brazil">Brazil</option>
                    <option value="Russia">Russia</option>
                    <option value="Japan">Japan</option>
                    <option value="South Korea">South Korea</option>
                    <option value="Mexico">Mexico</option>
                    <option value="South Africa">South Africa</option>
                    <option value="Nigeria">Nigeria</option>
                    <option value="Italy">Italy</option>
                    <option value="Spain">Spain</option>
                    <option value="Indonesia">Indonesia</option>
                    <option value="Turkey">Turkey</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="Argentina">Argentina</option>
                    <option value="Egypt">Egypt</option>
                    <option value="Malaysia">Malaysia</option>
                    <option value="Philippines">Philippines</option>
                    <option value="Thailand">Thailand</option>
                    <option value="Vietnam">Vietnam</option>
                    <option value="Netherlands">Netherlands</option>
                    <option value="Singapore">Singapore</option>
                    <option value="New Zealand">New Zealand</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone Number</label>
                  <input
                    type="text"
                    autoComplete='tel'
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Referral Code</label>
                  <input
                    type="text"
                    value={referCode}
                    onChange={(e) => setReferCode(e.target.value)}
                    placeholder="not required"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                </div>

                {!loader ? (
                  <button
                    type="submit"
                    onClick={(e) => handleSignup(e)}
                    className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                    Sign up
                  </button>
                ) : (
                  <button
                    disabled
                    type="button"
                    className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                    <svg
                      aria-hidden="true"
                      role="status"
                      className="inline w-4 h-4 mr-3 text-white animate-spin"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="#E5E7EB"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentColor"
                      />
                    </svg>
                    Sign up...
                  </button>
                )}
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Do you have an account already?
                  <a
                    onClick={() => navigate("/login")}
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500 cursor-pointer">
                    Log in
                  </a>
                </p>
              </form>
              <button
                aria-label="Continue with google"
                role="button"
                onClick={handleGoogleLogin}
                className="focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-700 py-3.5 px-4 border rounded-lg border-gray-700 flex items-center w-full mt-10">
                <svg
                  width={19}
                  height={20}
                  viewBox="0 0 19 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M18.9892 10.1871C18.9892 9.36767 18.9246 8.76973 18.7847 8.14966H9.68848V11.848H15.0277C14.9201 12.767 14.3388 14.1512 13.047 15.0812L13.0289 15.205L15.905 17.4969L16.1042 17.5173C17.9342 15.7789 18.9892 13.221 18.9892 10.1871Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M9.68813 19.9314C12.3039 19.9314 14.4999 19.0455 16.1039 17.5174L13.0467 15.0813C12.2286 15.6682 11.1306 16.0779 9.68813 16.0779C7.12612 16.0779 4.95165 14.3395 4.17651 11.9366L4.06289 11.9465L1.07231 14.3273L1.0332 14.4391C2.62638 17.6946 5.89889 19.9314 9.68813 19.9314Z"
                    fill="#34A853"
                  />
                  <path
                    d="M4.17667 11.9366C3.97215 11.3165 3.85378 10.6521 3.85378 9.96562C3.85378 9.27905 3.97215 8.6147 4.16591 7.99463L4.1605 7.86257L1.13246 5.44363L1.03339 5.49211C0.37677 6.84302 0 8.36005 0 9.96562C0 11.5712 0.37677 13.0881 1.03339 14.4391L4.17667 11.9366Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M9.68807 3.85336C11.5073 3.85336 12.7344 4.66168 13.4342 5.33718L16.1684 2.59107C14.4892 0.985496 12.3039 0 9.68807 0C5.89885 0 2.62637 2.23672 1.0332 5.49214L4.16573 7.99466C4.95162 5.59183 7.12608 3.85336 9.68807 3.85336Z"
                    fill="#EB4335"
                  />
                </svg>
                <p className="text-base font-medium ml-4 text-gray-700">
                  Continue with Google
                </p>
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Signup;