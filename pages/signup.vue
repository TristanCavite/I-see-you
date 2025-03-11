<template>
  <div class="flex h-screen items-center justify-center bg-[url('/bg.jpg')] bg-cover">
    <div
      class="w-full max-w-[400px] border border-border/60 bg-card px-8 py-5 shadow-sm dark:border-border min-[480px]:rounded-lg"
    >
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

      <p class="mt-8 text-sm text-muted-foreground">
        Already have an account?
        <NuxtLink class="font-semibold text-primary underline-offset-2 hover:underline" to="/"
          >Log in</NuxtLink
        >
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile,
  } from "firebase/auth";
  import { doc, setDoc } from "firebase/firestore";
  import { useRouter } from "vue-router";
  import { useFirebaseAuth, useFirestore } from "vuefire";
  import { object, string, ref as yupRef } from "yup";
  import type { InferType } from "yup";

  useSeoMeta({
    title: "Sign up",
    description: "Create an account with your email and password or continue with Google.",
  });

  
  const auth = useFirebaseAuth();
  const db = useFirestore();
  const router = useRouter();

 
  const SignupSchema = object({
    firstName: string().required().label("First Name"),
    lastName: string().required().label("Last Name"),
    email: string().email().required().label("Email"),
    password: string().required().min(6).label("Password"),
    confirmPassword: string()
      .oneOf([yupRef("password")], "Passwords must match")
      .required()
      .label("Confirm Password"),
  });

  const { handleSubmit, isSubmitting } = useForm<InferType<typeof SignupSchema>>({
    validationSchema: SignupSchema,
  });


  const firstName = ref("");
  const lastName = ref("");
  const email = ref("");
  const password = ref("");
  const confirmPassword = ref("");
  const errorMessage = ref("");


  const submit = handleSubmit(async () => {
    if (!auth || !db) return;
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.value,
        password.value
      );
      const user = userCredential.user;

      
      await updateProfile(user, {
        displayName: `${firstName.value} ${lastName.value}`,
      });

     
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        createdAt: new Date(),
      });

      useSonner("Account created successfully!", {
        description: "Redirecting to the dashboard...",
      });
      router.push("/");
    } catch (error) {
      errorMessage.value = "Error signing up. Please try again.";
    }
  });


  const signUpWithGoogle = async () => {
    if (!auth || !db) return;
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

     
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
      router.push("/admin/dashboard");
    } catch (error) {
      errorMessage.value = "Google sign-up failed. Please try again.";
    }
  };
</script>
