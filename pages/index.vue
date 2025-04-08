<template>
  <div class="flex h-screen items-center justify-center bg-cover bg-[url('/bg.jpg')] bg-black/40 backdrop-blur-lg">
    <div
      class="w-full max-w-[380px] border border-border/60 bg-white/90 px-8 py-6 shadow-lg rounded-lg dark:bg-card dark:border-border"
    >
      <h1 class="text-3xl font-bold text-primary tracking-tight">Log in</h1>
      <p class="mt-1 text-sm text-muted-foreground">Log in with your email and password or continue with Google.</p>

      <form class="mt-6" @submit="submit">
        <fieldset :disabled="isSubmitting" class="grid gap-4">
          <div>
            <UiVeeInput v-model="email" label="Email" type="email" name="email" placeholder="john@example.com" />
          </div>
          <div>
            <UiVeeInput v-model="password" label="Password" type="password" name="password" />
          </div>
          <p v-if="errorMessage" class="text-red-500 text-sm">{{ errorMessage }}</p>
          <div>
            <UiButton class="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2 rounded-md" type="submit" text="Log in" />
          </div>
        </fieldset>
      </form>

      <p class="mt-4 text-center text-xs uppercase font-medium text-muted-foreground">Or</p>

      <div class="mt-4">
        <UiButton
          class="w-full bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium flex items-center justify-center gap-2 py-2 rounded-md shadow-sm"
          @click="signInWithGoogle"
        >
          <img src="/google-icon.svg" class="w-5 h-5" alt="Google logo" />
          Continue with Google
        </UiButton>
      </div>

      <div class="mt-6 flex flex-col gap-2 text-sm text-center">
        <NuxtLink class="text-primary font-semibold hover:underline" to="#">Forgot password?</NuxtLink>
       <NuxtLink class="font-semibold text-primary underline-offset-2 hover:underline" to="/signup">
    Create an account
  </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { object, string } from "yup";
import type { InferType } from "yup";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useFirebaseAuth } from "vuefire";
import { useRouter } from "vue-router";



useSeoMeta({
  title: "Log in",
  description: "Log in with your email and password or continue with Google.",
});


definePageMeta({
  colorMode: "light",
})


const auth = useFirebaseAuth();
const router = useRouter();




const LoginSchema = object({
  email: string().email().required().label("Email"),
  password: string().required().min(6).label("Password"),
});

const { handleSubmit, isSubmitting } = useForm<InferType<typeof LoginSchema>>({
  validationSchema: LoginSchema,
});

const email = ref("");
const password = ref("");
const errorMessage = ref("");

const submit = handleSubmit(async () => {
  if (!auth) return;
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    useSonner("Logged in successfully!", { description: "Redirecting to the dashboard..." });
    router.push("/dashboard");
  } catch (error) {
    errorMessage.value = "Invalid email or password. Please try again.";
  }
});


const signInWithGoogle = async () => {
  if (!auth) return;
  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    useSonner("Logged in successfully!", { description: "Redirecting to the dashboard..." });
    router.push("/dashboard");
  } catch (error) {
    errorMessage.value = "Google sign-in failed. Please try again.";
  }
};
</script>
