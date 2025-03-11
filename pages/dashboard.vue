<template>
  <div class="p-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">Stalked Infos</h1>
      
   
      <button @click="logout" class="bg-red-700 text-white px-4 py-2 rounded">Logout</button>
    </div>
    
    

    <button @click="showAddModal = true" class="bg-blue-900 text-white px-4 py-2 rounded mt-4">
      Add Person
    </button>
    

    <div class="mt-4 space-y-3">
      <div 
        v-for="person in people" 
        :key="person.id" 
        class="flex items-center justify-between p-4 border rounded shadow"
      >
        <div @click="openDetails(person)" class="cursor-pointer">
          <strong>{{ person.firstName }} {{ person.lastName }}</strong>
          <p class="text-sm text-gray-600">{{ person.email }}</p>
        </div>

        
        <button @click="deletePerson(person.id)" class="text-red-500 hover:text-red-700">
          <img src="@/assets/trash.svg" alt="Delete" class="w-6 h-6">
        </button>
      </div>
    </div>

   
    <Modal v-if="showAddModal" @close="showAddModal = false">
      <template #header>
        <h2 class="text-xl font-bold">Add Person</h2>
      </template>
      <template #body>
        <input v-model="newPerson.imageUrl" placeholder="Profile Image URL" class="input-field" />
        <input v-model="newPerson.firstName" placeholder="First Name" class="input-field" />
        <input v-model="newPerson.lastName" placeholder="Last Name" class="input-field" />
        <input v-model="newPerson.likes" placeholder="Likes" class="input-field" />
        <input v-model="newPerson.dislikes" placeholder="Dislikes" class="input-field" />
        <input v-model="newPerson.address" placeholder="Address" class="input-field" />
        <input v-model="newPerson.email" placeholder="Email" class="input-field" />
        <input v-model="newPerson.phone" placeholder="Phone Number" class="input-field" />
        <input v-model="newPerson.course" placeholder="Course" class="input-field" />
        <input v-model="newPerson.year" placeholder="Year" class="input-field" />
      </template>
      <template #footer>
        <button @click="addPerson" class="bg-green-500 text-white px-4 py-2 rounded">Save</button>
      </template>
    </Modal>

    
    <Modal v-if="showDetailsModal" @close="showDetailsModal = false">
      <template #header>
        <h2 class="text-xl font-bold">{{ selectedPerson.firstName }} {{ selectedPerson.lastName }}</h2>
      </template>
      <template #body>
        <img :src="selectedPerson.imageUrl" alt="Profile Picture" class="w-32 h-32 rounded-full mx-auto" />
        <p><strong>Likes:</strong> {{ selectedPerson.likes }}</p>
        <p><strong>Dislikes:</strong> {{ selectedPerson.dislikes }}</p>
        <p><strong>Address:</strong> {{ selectedPerson.address }}</p>
        <p><strong>Email:</strong> {{ selectedPerson.email }}</p>
        <p><strong>Phone:</strong> {{ selectedPerson.phone }}</p>
        <p><strong>Course:</strong> {{ selectedPerson.course }}</p>
        <p><strong>Year:</strong> {{ selectedPerson.year }}</p>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useFirestore, useCollection } from 'vuefire';
import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';
import Modal from '@/components/Modal.vue';
import { useRouter } from 'vue-router';


const db = useFirestore();
const peopleRef = collection(db, 'stalked_users');
const people = useCollection(peopleRef);
const auth = getAuth();
const router = useRouter();


const showAddModal = ref(false);
const showDetailsModal = ref(false);
const selectedPerson = ref({});
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


const addPerson = async () => {
  await addDoc(peopleRef, newPerson.value);
  showAddModal.value = false;
};


const deletePerson = async (id) => {
  if (confirm("Are you sure you want to delete this person?")) {
    await deleteDoc(doc(db, 'stalked_users', id));
  }
};


const openDetails = (person) => {
  selectedPerson.value = person;
  showDetailsModal.value = true;
};

const logout = async () => {
  await signOut(auth);
  router.push('/');
};


</script>

<style>
.input-field {
  display: block;
  width: 100%;
  padding: 8px;
  margin: 5px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
