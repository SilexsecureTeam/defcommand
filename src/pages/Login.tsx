import { useState, useEffect } from "react";
import { FaAngleRight, FaSpinner } from "react-icons/fa";
import PhoneInput from "react-phone-input-2";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import OtpInput from "react-otp-input";
import { useForm } from "react-hook-form";
import "react-phone-input-2/lib/style.css";
import useAuth from "../hooks/useAuth";
import RootRedirect from "../routes/RootRedirect";

export default function LoginScreen() {
  const [syncEnabled, setSyncEnabled] = useState(true);
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("ng");
  const [isValid, setIsValid] = useState(true);
  const [otpRequested, setOtpRequested] = useState(false);
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);

  const { requestOtp, verifyOtp, isLoading } = useAuth();
  const { setValue, trigger } = useForm({ mode: "onChange" });

  // Validate phone number
  useEffect(() => {
    if (!phone) {
      setIsValid(true);
      return;
    }

    const parsed = parsePhoneNumberFromString(`+${phone}`);
    setIsValid(parsed ? parsed.isValid() : false);
  }, [phone]);

  // OTP countdown
  useEffect(() => {
    if (!otpRequested || timer === 0) return;

    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [otpRequested, timer]);

  const handleNext = async () => {
    if (!isValid || phone.length < 7) return;

    const payload = { phone: `+${phone}` };
    const response = await requestOtp(payload);

    if (response) {
      setOtpRequested(true);
      setTimer(60);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length === 4) {
      await verifyOtp({ phone: `+${phone}`, otp });
    }
  };

  const handleResendOtp = async () => {
    const payload = { phone: `+${phone}` };
    await requestOtp(payload);
    setOtp("");
    setTimer(60);
  };

  return (
    <RootRedirect>
      <div className="relative h-screen w-screen overflow-hidden text-[#e3f5e3]">
        {/* Base Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#36450D_0%,#111111_70%)]" />

        {/* Tile Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(20,20,20,.4)_1px,transparent_1px),linear-gradient(90deg,rgba(20,20,20,.4)_1px,transparent_1px)] bg-size-[40px_40px]" />

        {/* Branding */}
        <div className="absolute top-8 left-8 z-10 flex items-center gap-3">
          <img src="/logo.png" alt="Defcomm" className="w-40" />
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center mt-1">
          {!otpRequested ? (
            <>
              <h2 className="text-2xl font-semibold">Sign in</h2>
              <p className="mt-1 text-sm opacity-70">
                With Defcomm Credentials
              </p>

              {/* Phone Input */}
              <div
                className={`mt-6 w-[320px] flex items-center rounded-lg border backdrop-blur ${
                  isValid ? "border-[#E3E5E5]" : "border-red-500"
                } bg-black/20`}
              >
                <PhoneInput
                  country={country}
                  value={phone}
                  onChange={(value, countryData) => {
                    setPhone(value);
                    setValue("phone", value, { shouldValidate: true });
                    setCountry((countryData as any)?.countryCode || "ng");
                    trigger("phone");
                  }}
                  inputProps={{ name: "phone", required: true }}
                  inputStyle={{
                    width: "100%",
                    height: "50px",
                    background: "transparent",
                    color: "#e3f5e3",
                    border: "none",
                  }}
                  containerStyle={{
                    height: "50px",
                    background: "transparent",
                  }}
                  containerClass="bg-transparent"
                  buttonClass="!bg-transparent !border-none"
                  dropdownClass="!bg-[#111] !text-gray-400 text-left rounded-lg"
                />
              </div>

              {!isValid && phone.length > 3 && (
                <span className="mt-1 text-xs text-red-400">
                  Enter a valid mobile number
                </span>
              )}
            </>
          ) : (
            <>
              {/* OTP Screen */}
              <h2 className="text-2xl font-semibold">Verify OTP</h2>
              <p className="mt-1 text-sm opacity-70">
                Use PIN to unlock fast and secure way
              </p>

              <OtpInput
                value={otp}
                onChange={(value) => /^\d*$/.test(value) && setOtp(value)}
                numInputs={4}
                containerStyle="flex justify-center gap-4 mt-6"
                inputStyle={{
                  background: "transparent",
                  border: "1px solid #8bdc3c",
                  borderRadius: "12px",
                  color: "#e3f5e3",
                  width: "55px",
                  height: "55px",
                  fontSize: "24px",
                  textAlign: "center",
                }}
                shouldAutoFocus
                renderInput={(props) => (
                  <input {...props} inputMode="numeric" />
                )}
              />

              <div className="mt-4 text-sm opacity-70">
                {timer > 0 ? (
                  <>
                    Send code again{" "}
                    <span className="font-medium">
                      00:{String(timer).padStart(2, "0")}
                    </span>
                  </>
                ) : (
                  <button
                    onClick={handleResendOtp}
                    className="text-[#8bdc3c] hover:underline"
                  >
                    Resend code
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {/* Bottom Action Button */}
        <button
          className="absolute bottom-16 right-12 z-10 flex h-16 w-16 items-center justify-center rounded-full bg-oliveGreen text-2xl font-light text-white shadow-lg transition hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next"
          disabled={
            (!otpRequested &&
              (!isValid ||
                phone.length < 7 ||
                isLoading?.requestOtp ||
                isLoading?.verifyOtp)) ||
            (otpRequested && otp.length !== 4)
          }
          onClick={otpRequested ? handleVerifyOtp : handleNext}
        >
          {isLoading?.requestOtp || isLoading?.verifyOtp ? (
            <FaSpinner className="animate-spin" />
          ) : (
            <FaAngleRight />
          )}
        </button>

        {/* Footer Left — Toggle Switch */}
        <div className="absolute bottom-8 left-8 z-10 flex items-center gap-3 md:gap-10 text-sm">
          <span className="opacity-80">Sync Tactical Units</span>

          <button
            onClick={() => setSyncEnabled((v) => !v)}
            className={`relative flex h-6 w-11 items-center rounded-full transition ${
              syncEnabled ? "bg-oliveHover" : "bg-gray-600"
            }`}
            aria-pressed={syncEnabled}
            aria-label="Toggle Sync Tactical Units"
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
                syncEnabled ? "translate-x-5.5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        {/* Footer Right */}
        <span className="absolute bottom-8 right-8 z-10 cursor-pointer text-xs opacity-60 hover:opacity-90">
          Use online instead of local account…
        </span>
      </div>
    </RootRedirect>
  );
}
