<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">Stalked Infos</h1>
      <button @click="logout" class="bg-red-700 text-white px-4 py-2 rounded">Logout</button>
    </div>

    <!-- Add Person Button -->
    <button 
      @click="showAddModal = true" 
      class="bg-blue-900 text-white px-4 py-2 rounded mt-4"
    >
      Add Person
    </button>

    <!-- List of People -->
    <div v-if="people.length" class="mt-4 space-y-3">
      <div 
        v-for="person in people" 
        :key="person.id" 
        class="flex items-center justify-between p-4 border rounded shadow"
      >
        <div @click="openDetails(person)" class="cursor-pointer">
          <strong>{{ person.firstName }} {{ person.lastName }}</strong>
          <p class="text-sm text-gray-600">{{ person.email }}</p>
        </div>
        <button 
          @click="deletePerson(person.id)" 
          class="text-red-500 hover:text-red-700"
        >
          <img src="@/assets/trash.svg" alt="Delete" class="w-6 h-6">
        </button>
      </div>
    </div>

    <!-- No Data Message -->
    <p v-else class="mt-4 text-gray-500">No people added yet. Click "Add Person" to start.</p>

    <!-- Add Person Modal (Separate Component) -->
    <AddPersonModal 
      :show="showAddModal" 
      :personData="newPerson" 
      @close="showAddModal = false" 
      @save="addPerson"
    />

    <!-- Details Modal -->
    <Modal v-if="showDetailsModal" @close="showDetailsModal = false" size="md">
      <template #header>
        <h2 class="text-xl font-bold">
          {{ selectedPerson?.firstName }} {{ selectedPerson?.lastName }}
        </h2>
      </template>
      <template #body>
        <div class="space-y-2">
          <img 
            v-if="selectedPerson?.imageUrl" 
            :src="selectedPerson.imageUrl" 
            alt="Profile Picture" 
            class="w-32 h-32 rounded-full mx-auto"
          />
          <p><strong>Likes:</strong> {{ selectedPerson?.likes }}</p>
          <p><strong>Dislikes:</strong> {{ selectedPerson?.dislikes }}</p>
          <p><strong>Address:</strong> {{ selectedPerson?.address }}</p>
          <p><strong>Email:</strong> {{ selectedPerson?.email }}</p>
          <p><strong>Phone:</strong> {{ selectedPerson?.phone }}</p>
          <p><strong>Course:</strong> {{ selectedPerson?.course }}</p>
          <p><strong>Year:</strong> {{ selectedPerson?.year }}</p>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useFirestore, useCollection, useCurrentUser } from 'vuefire';
import { collection, query, where, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'vue-router';
import Modal from '@/components/Modal.vue';
import AddPersonModal from '@/components/AddPersonModal.vue';

const db = useFirestore();
const auth = getAuth();
const router = useRouter();
const user = useCurrentUser();

// Firestore query: Fetch only logged-in user's data
const peopleRef = collection(db, 'stalked_users');
const peopleQuery = computed(() => 
  user.value ? query(peopleRef, where('userId', '==', user.value.uid)) : null
);
const people = useCollection(peopleQuery);

// Modal state
const showAddModal = ref(false);
const showDetailsModal = ref(false);
const selectedPerson = ref(null);

// New person form
const newPerson = ref({
  imageUrl: '',
  firstName: '',
  lastName: '',
  likes: '',
  dislikes: '',
  address: '',
  email: '',
  phone: '',
  course: '',
  year: ''
});

// Function to add a new person
const addPerson = async (data) => {
  if (!user.value) return;
  await addDoc(peopleRef, { ...data, userId: user.value.uid });

  // Reset form and close modal
  newPerson.value = {
    imageUrl: '',
    firstName: '',
    lastName: '',
    likes: '',
    dislikes: '',
    address: '',
    email: '',
    phone: '',
    course: '',
    year: ''
  };
  showAddModal.value = false;
};

// Function to delete a person
const deletePerson = async (id) => {
  if (confirm("Are you sure you want to delete this person?")) {
    await deleteDoc(doc(db, 'stalked_users', id));
  }
};

// Function to open details modal
const openDetails = (person) => {
  selectedPerson.value = person;
  showDetailsModal.value = true;
};

// Logout function
const logout = async () => {
  await signOut(auth);
  router.push('/');
};
</script>
