<template>
  <div class="flex h-screen items-center justify-center bg-[url('/bg.jpg')] bg-cover">
    <div
      class="w-full max-w-[400px] border border-border/60 bg-card px-8 py-5 shadow-sm dark:border-border min-[480px]:rounded-lg relative top-[-5vh] "
    >
    <div class="overflow-y-auto max-h-[70vh] px-2">
      <h1 class="text-2xl font-bold tracking-tight lg:text-3xl">Create an account</h1>
      <p class="mt-1 text-muted-foreground">
        Sign up with your email and password or continue with Google.
      </p>

      <form class="mt-8" @submit="submit">
        <fieldset :disabled="isSubmitting" class="grid gap-4">
          <div>
            <UiVeeInput
              v-model="firstName"
              label="First Name"
              type="text"
              name="firstName"
              placeholder="John"
            />
          </div>
          <div>
            <UiVeeInput
              v-model="lastName"
              label="Last Name"
              type="text"
              name="lastName"
              placeholder="Doe"
            />
          </div>
          <div>
            <UiVeeInput
              v-model="email"
              label="Email"
              type="email"
              name="email"
              placeholder="john@example.com"
            />
          </div>
          <div>
            <UiVeeInput v-model="password" label="Password" type="password" name="password" />
          </div>
          <div>
            <UiVeeInput
              v-model="confirmPassword"
              label="Confirm Password"
              type="password"
              name="confirmPassword"
            />
          </div>
          <p v-if="errorMessage" class="text-sm text-red-500">{{ errorMessage }}</p>
          <div>
            <UiButton class="w-full text-white" type="submit" text="Sign up" />
          </div>
        </fieldset>
      </form>

      <p class="mt-4 text-center text-sm">OR</p>
      <div class="mt-4">
        <UiButton
          class="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white py-2 font-medium text-gray-700 shadow-sm hover:bg-gray-100"
          @click="signUpWithGoogle"
        >
          <img src="/google-icon.svg" class="h-5 w-5" alt="Google logo" />
          Sign up with Google
        </UiButton>
      </div>

      <p class="mt-8 text-sm text-muted-foreground text-center">
        Already have an account?
        <NuxtLink class="font-semibold text-primary underline-offset-2 hover:underline" to="/"
          >Log in</NuxtLink
        >
      </p>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { useRouter } from "vue-router";
import { useFirebaseAuth } from "vuefire";
import { object, string, ref as yupRef } from "yup";
import type { InferType } from "yup";

useSeoMeta({
  title: "Sign up",
  description: "Create an account with your email and password or continue with Google.",
});

// ✅ Initialize Firebase
const auth = useFirebaseAuth();
const db = getFirestore();
const router = useRouter();

// ✅ Signup Validation Schema
const SignupSchema = object({
  firstName: string().required().label("First Name"),
  lastName: string().required().label("Last Name"),
  email: string().email().required().label("Email"),
  password: string().required().min(6).label("Password"),
  confirmPassword: string().oneOf([yupRef("password")], "Passwords must match").required()
});

// ✅ Form Handling
const { handleSubmit, isSubmitting } = useForm<InferType<typeof SignupSchema>>({
  validationSchema: SignupSchema,
});

// ✅ Reactive Form Fields
const firstName = ref("");
const lastName = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const errorMessage = ref("");

// ✅ Sign-up with Email & Password
const submit = handleSubmit(async () => {
  errorMessage.value = ""; // Clear previous errors
  if (!auth || !db) {
    errorMessage.value = "Firebase is not initialized.";
    return;
  }

  try {
    // ✅ Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
    const user = userCredential.user;

    if (!user.uid) {
      errorMessage.value = "User authentication failed.";
      return;
    }

    // ✅ Update Firebase Auth profile
    await updateProfile(user, {
      displayName: `${firstName.value} ${lastName.value}`,
    });

    // ✅ Save user info to Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      createdAt: new Date(),
    });

    // ✅ Show success message and redirect
    useSonner("Account created successfully!", { description: "Redirecting to the dashboard..." });
    router.push("/dashboard");
  } catch (error: any) {
    errorMessage.value = error.message || "Error signing up. Please try again.";
  }
});

// ✅ Sign-up with Google
const signUpWithGoogle = async () => {
  errorMessage.value = ""; // Clear previous errors

  if (!auth || !db) {
    errorMessage.value = "Firebase is not initialized.";
    return;
  }

  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    if (!user.uid) {
      errorMessage.value = "Google authentication failed.";
      return;
    }

    const fullName = user.displayName?.split(" ") || [];
    const firstName = fullName[0] || "";
    const lastName = fullName.length > 1 ? fullName.slice(1).join(" ") : "";

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      firstName,
      lastName,
      email: user.email,
      createdAt: new Date(),
    });

    useSonner("Signed up successfully!", { description: "Redirecting to the dashboard..." });
    router.push("/dashboard");
  } catch (error: any) {
    errorMessage.value = error.message || "Google sign-up failed. Please try again.";
  }
};
</script>

<style>
  .overflow-y-auto {
  scrollbar-width: none; /* Hide scrollbar for Firefox */
  -ms-overflow-style: none; /* Hide scrollbar for IE & Edge */
}

.overflow-y-auto::-webkit-scrollbar {
  display: none; /* Hide scrollbar for Chrome, Safari */
}

</style>