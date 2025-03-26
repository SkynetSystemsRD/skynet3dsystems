<script setup lang="ts">
import { register } from 'swiper/element/bundle';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import 'video.js/dist/video-js.css';
import { ref } from 'vue';

const router = useRouter()

register();

interface ModelItem {
  id: number
  fileName: string
  filePath: string
  format: string
  size: number
  octetStreamContent: string
  uuid: string
  dimentions: xyz;
  weight: number;
}

interface xyz {
  x: number | undefined,
  y: number | undefined,
  z: number | undefined,
}

interface image {
  alt: string;
  imagePath: string;
  fileExtention: string;
}

interface projectDetails {
  title: string | undefined;
  about: string;
  client: string;
  modelCheckoutCartDataLocal: ModelItem[];
  format: string;
  fileName: string,
  dimentions: xyz[];
  materials: string;
  totalPrints: number;
  weight: number;
  time: string;
  description: string;
  images: image[];
}

const scene = new THREE.Scene();
const fileUploadMessage = ref('Sube Tu Imagen')
const fileUploadIcon = ref('tabler-cloud-upload')
const fileUploadFormat = ref('')
const fileModelContent = ref('')
const route = useRoute()
const canvas = ref(null);
const fileContent = ref('')
const fileInput = ref(null);
const projectId = ref(route.query.projectId)
const projectNumber = ref(route.query.projectNumber)
const loadings = ref(false)
const panelStatus = ref(0);
const selectedElement = ref('image')
const isDownloading = ref(false)
const instructions = [
  {
    title: "👋 Manipulación del Modelo 3D",
    topics: [
      {
        title: "Mover la entorno",
        instruction1: "Mantén presionado el botón derecho del ratón",
        instruction2: "y mueve el ratón para mover el entorno de la escena.",
        icon: "tabler-direction"
      },
      {
        title: "Rotar la cámara",
        instruction1: "Mantén presionado el botón izquierdo del ratón",
        instruction2: "y mueve el ratón para rotar el entorno de la escena.",
        icon: "tabler-rotate"
      },
      // {
      //   title: "Rotacion Manual/Automatica del modelo 3D",
      //   instruction1: "Seleccione el modelo que desea rotar luego presione el boton de rotar y el check",
      //   instruction2: "de rotacion automatica, lo mismo para la rotacion manual.",
      //   icon: "tabler-rotate-2"
      // },
      {
        title: "Acercar/Lejar el Modelo",
        instruction1: "Usa la rueda del ratón para acercar o alejar el modelo.",
        instruction2: "",
        icon: "tabler-zoom"
      },
      {
        title: "Mover el Modelo",
        instruction1: "Seleccion con click izquierdo y mantén presionado el botón izquierdo del ratón y arrastra para ",
        instruction2: "mover el modelo 3D.",
        icon: "tabler-mouse"
      },
    ]
  }
]

const projectDetails = ref<projectDetails>({
  title: ``,
  about: "Este proyecto muestra un Cubo XYZ en formato GLTF, utilizado para calibrar y verificar la orientación de los ejes en entornos 3D. Permite analizar la alineación, escala y rotación del modelo en un visor interactivo.",
  client: "John Doe",
  modelCheckoutCartDataLocal: [
    // {
    //   id: 1,
    //   format: getFileExtention('/xyzCalibration_cube.gltf'),
    //   filePath: '/xyzCalibration_cube.gltf',
    //   fileName: 'xyzCalibration_cube.gltf',
    //   size: 235654,
    //   octetStreamContent: '',
    //   uuid: '',
    //   dimentions: {
    //     x: 42,
    //     y: 42,
    //     z: 42
    //   },
    //   weight: 250
    // },
    // {
    //   id: 2,
    //   format: getFileExtention('/xyzCalibration_cube.gltf'),
    //   filePath: '/xyzCalibration_cube.gltf',
    //   fileName: 'xyzCalibration_cube.gltf',
    //   size: 235654,
    //   octetStreamContent: '',
    //   uuid: '',
    //   dimentions: {
    //     x: 42,
    //     y: 42,
    //     z: 42
    //   },
    //   weight: 250
    // },
    // {
    //   id: 3,
    //   format: getFileExtention('/xyzCalibration_cube.gltf'),
    //   filePath: '/xyzCalibration_cube.gltf',
    //   fileName: 'xyzCalibration_cube.gltf',
    //   size: 235654,
    //   octetStreamContent: '',
    //   uuid: '',
    //   dimentions: {
    //     x: 42,
    //     y: 42,
    //     z: 42
    //   },
    //   weight: 250
    // }
  ],
  fileName: '',
  format: '',
  dimentions: [{
    x: 0,
    y: 0,
    z: 0
  },
  ],
  weight: 0,
  materials: "PLA, ABS, PETG, Resina, etc.",
  totalPrints: 56,
  time: "4h 30m",
  description: "Este proyecto presenta un Cubo XYZ en formato GLTF, diseñado para la calibración y verificación de los ejes en entornos 3D. Facilita la evaluación de la alineación, escala y rotación del modelo mediante un visor interactivo, asegurando una correcta orientación en el espacio tridimensional.",
  images: [
    // { alt: "1", imagePath: main3dImage1, fileExtention: "png" },
    // { alt: "2", imagePath: main3dImage2, fileExtention: "png" },
    // { alt: "3", imagePath: main3dImage3, fileExtention: "png" },
    // { alt: "4", imagePath: main3dImage4, fileExtention: "png" },
    // { alt: "5", imagePath: main3dImage5, fileExtention: "png" },
    // { alt: "6", imagePath: main3dImage6, fileExtention: "png" },
  ]
});

// const selectOption = (option: string) => {
//   selectedElement.value = option;

//   if (selectedElement.value == 'model') {
//     reload()
//     initModels()
//   }
// }

const storedData = localStorage.getItem('userData');
const userData = storedData ? JSON.parse(storedData) : null;

// const getModelsByProjectId = async (projectId: string) => {
//   try {
//     // Await the response from axios
//     const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/models/getModelsByProjectId`, {
//       projectId: projectId
//     }, {
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     const models = response.data.models
//     return models
//   } catch (error) {
//     console.log('Error in getModelsByProjectId: ', error.response?.data?.message || error.message);
//     return null
//   }
// }

// const getProjectById = async () => {
//   try {

//     console.log(projectId.value)
//     // Await the response from axios
//     const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/projects/getProjectById`, {
//       projectId: projectId.value
//     }, {
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     const project = response.data.project
//     if (response.data.result) {

//       const models = await getModelsByProjectId(project._id)
//       let index = 1;

//       for (const m of models) {
//         projectDetails.value.images.push({
//           alt: (index).toString(),
//           imagePath: `data:image/png;base64,${m.fileImageContent}` || '',
//           fileExtention: "png"
//         })

//         projectDetails.value.modelCheckoutCartDataLocal.push({
//           id: index,
//           format: m.format,
//           filePath: `data:application/octet-stream;base64,${m.fileModelContent}`,
//           fileName: m.fileName,
//           size: m.size,
//           octetStreamContent: `data:application/octet-stream;base64,${m.fileModelContent}`,
//           uuid: m.uuid,
//           dimentions: {
//             x: m.dimentions.x,
//             y: m.dimentions.y,
//             z: m.dimentions.z
//           },
//           weight: m.weight
//         })

//         index++
//       }
//     }
//   } catch (error) {
//     console.log('Error in getProjectById: ', error.response?.data?.message || error.message);
//   }
// };

// {
//       id: 1,
//       format: getFileExtention('/xyzCalibration_cube.gltf'),
//       filePath: '/xyzCalibration_cube.gltf',
//       fileName: 'xyzCalibration_cube.gltf',
//       size: 235654,
//       octetStreamContent: '',
//       uuid: '',
//       dimentions: {
//         x: 42,
//         y: 42,
//         z: 42
//       },
//       weight: 250
//     },

function clearScene() {
  // Remove all children from the scene
  while (scene.children.length > 0) {
    let child = scene.children[0];

    // Dispose of geometries
    if (child.geometry) {
      child.geometry.dispose();
    }

    // Dispose of materials
    if (child.material) {
      if (Array.isArray(child.material)) {
        child.material.forEach(material => material.dispose());
      } else {
        child.material.dispose();
      }
    }

    // Remove from the scene
    scene.remove(child);
  }
}

function reload() {
  fileUploadMessage.value = 'Sube Tu Imagen'
  fileUploadIcon.value = 'tabler-cloud-upload'
  fileUploadFormat.value = ''
  fileContent.value = ''
  fileModelContent.value = ''
  clearScene()

  var container = document.getElementById("model-viewer");

  if (container) {  // Verifica si el contenedor existe
    var content = "";
    container.innerHTML = content;  // Recarga el contenido del contenedor

    // Esta línea es para ver el resultado en la consola, puedes eliminarla después
    console.log("Refreshed");
  } else {
    console.error("El contenedor no se encuentra en el DOM.");
  }
}

function getFileExtention(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1] : '';  // Returns the extension or an empty string if no extension
}

const uploadImage = (event) => {
  loadings.value = true;

  const file = event.target.files[0];
  console.log(file)
  if (!file) return;

  fileUploadMessage.value = "Eliminar el Modelo";
  fileUploadIcon.value = "tabler-x";

  const reader = new FileReader();
  reader.onload = (e) => {
    fileContent.value = e.target?.result;
    const img = new Image();
    img.onload = () => {
      loadings.value = false;
      generateGLTFFromImage(img);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);

  // 🔹 Obtener la extensión real del archivo 🔹
  fileUploadFormat.value = file.name.split(".").pop().toUpperCase();

  setTimeout(() => {
    loadings.value = false;
  }, 1000);

  console.log(fileContent.value)
};

const saveGLTFToServer = async (event, fileName = "TuModeloDeSkynet3DSystems.gltf") => {
  event?.preventDefault(); // Evitar la acción predeterminada si es un botón

  if (!fileModelContent.value) return;

  isDownloading.value = true;

  try {
    // Convertir Base64 a binario
    const base64Data = fileModelContent.value.replace(/^data:model\/gltf\+json;base64,/, "");
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "model/gltf+json" });

    // Enviar el archivo al servidor
    const formData = new FormData();
    formData.append("file", blob, fileName);

    const response = await fetch("/upload_gltf", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      console.log("GLTF guardado correctamente en el servidor.");
    } else {
      console.error("Error al guardar el archivo en el servidor.");
    }
  } catch (error) {
    console.error("Error al guardar GLTF:", error);
  } finally {
    isDownloading.value = false;
  }
};

function generateGLTFFromImage(image, isRelief = true) {
  if (!image) {
    alert("Por favor, sube una imagen primero.");
    return;
  }

  const ctx = canvas.value.getContext("2d");
  canvas.value.width = image.width;
  canvas.value.height = image.height;

  ctx.drawImage(image, 0, 0);

  const imageData = ctx.getImageData(0, 0, image.width, image.height).data;
  console.log(image.width, image.height, image.width, image.height)

  const geometry = new THREE.PlaneGeometry(image.width, image.height, image.width, image.height);

  // Calcular el centro de la geometría
  const centerX = image.width / 2;
  const centerY = image.height / 2;

  // Aplicar altura en base a los valores de gris y centralizar la malla
  for (let i = 0; i < geometry.attributes.position.count; i++) {
    const x = i % image.width;
    const y = Math.floor(i / image.width);
    const index = (y * image.width + x) * 4;

    // Convertir a escala de grises y ajustar la altura
    const grayscale = imageData[index] / 255;
    let zHeight = grayscale * 10;

    // Si es con relieve, incrementar la altura
    if (isRelief) {
      zHeight = grayscale * -10; // Aumentar el relieve (más grosor)
    }

    // Aplicar un desplazamiento para centrar la geometría
    geometry.attributes.position.setXYZ(i, x - centerX, centerY - y, zHeight);
  }

  geometry.computeVertexNormals();

  // Crear material y malla para la geometría
  const material = new THREE.MeshStandardMaterial({ color: 0x555555 });
  const mesh = new THREE.Mesh(geometry, material);

  // Exportar el modelo como GLTF (esto será un objeto JSON para GLTF)
  const exporter = new GLTFExporter();
  exporter.parse(mesh, (result) => {
    const jsonString = JSON.stringify(result);
    const blob = new Blob([jsonString], { type: 'application/json' });

    // Convertir Blob a Base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(",")[1]; // Extraer solo la parte base64
      fileModelContent.value = base64String;
      initModel({ format: 'gltf', octetStreamContent: base64String });
    };

    reader.readAsDataURL(blob);
  });
}

const download = async (event, fileName = "TuModeloDeSkynet3DSystems.gltf") => {
  event?.preventDefault(); // Prevent default action if triggered by a button click

  if (!fileModelContent.value) return;

  isDownloading.value = true;

  try {
    // Convert Base64 to binary
    const base64Data = fileModelContent.value.replace(/^data:model\/gltf\+json;base64,/, "");
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "model/gltf+json" });
    const fileURL = URL.createObjectURL(blob);

    // Load the GLTF model
    const loader = new GLTFLoader();
    loader.load(
      fileURL,
      (gltf) => {
        const scene = gltf.scene;

        // 🔹 Scale down by 50%
        scene.scale.set(0.1, 0.1, 0.1);

        // 🔹 Flip the model on X-axis to mirror it
        scene.scale.x *= -1;

        // 🔹 Fix normals if needed
        scene.traverse((child) => {
          if (child.isMesh) {
            child.geometry.computeVertexNormals();
            child.material.side = THREE.FrontSide; // Ensure correct face rendering
          }
        });

        // Export the modified model
        const exporter = new GLTFExporter();
        exporter.parse(
          scene,
          (gltfData) => {
            const gltfBlob = new Blob([JSON.stringify(gltfData)], { type: "model/gltf+json" });

            // Create a downloadable link
            const link = document.createElement("a");
            link.href = URL.createObjectURL(gltfBlob);
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          },
          { binary: false } // Export as JSON GLTF
        );

        isDownloading.value = false;
      },
      undefined,
      (error) => {
        console.error("Error loading GLTF:", error);
        isDownloading.value = false;
      }
    );
  } catch (error) {
    console.error("Download failed:", error);
    isDownloading.value = false;
  }
};

const dbRequest = indexedDB.open('OctetDB', 1);

dbRequest.onupgradeneeded = function (event) {
  let db = event.target.result;
  db.createObjectStore('dataStore', { keyPath: 'id' });
};

const saveData = (id, content) => {
  const dbRequest = indexedDB.open('OctetDB', 1);

  dbRequest.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction('dataStore', 'readwrite');
    const store = transaction.objectStore('dataStore');

    store.put({ id, content });
  };
};

const quote = async () => {
  if (!fileModelContent.value)
    return;

  saveData('octetData', `data:application/octet-stream;base64,${fileModelContent.value}`);
  saveData('imageData', `data:image/png;base64,${fileContent.value}`);

  await router.push({
    path: '/main-pages/model-checkout',
    query: { from: 'image-to-3d' }  // Set your query parameter here
  });
}

const initModel = (modelItem) => {
  scene.background = new THREE.Color(0xdddddd);

  const camera = new THREE.PerspectiveCamera(75, 1000 / 600, 0.1, 1000);
  camera.position.set(30, 30, 30);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  // renderer.setSize(1000, 600);
  document.getElementById('model-viewer')?.appendChild(renderer.domElement);

  // Redimensiona el renderizador según el tamaño del contenedor
  function resizeRenderer() {
    const container = document.getElementById('model-viewer');

    if (!container) {
      console.log("not container");
      return;
    }

    let width = container.clientWidth;
    let height = container.clientHeight;

    if (width === 0 || height === 0) {
      console.log("Tamaño 0, reintentando...");
      setTimeout(resizeRenderer, 200); // Reintenta después de 100ms
      return;

    }
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  nextTick(() => {
    resizeRenderer();
    window.addEventListener('resize', resizeRenderer); 333
  });

  setTimeout(() => {
    resizeRenderer();  // Llamar a resizeRenderer después de un pequeño retraso
  }, 100);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Agrega un evento para detectar cambios en el control de la cámara
  controls.addEventListener('change', () => {

  });

  // Luz ambiental para iluminación general suave
  const hlight = new THREE.AmbientLight(0x404040, 1);  // Luz más suave
  scene.add(hlight);

  // Luz direccional ejes positivos
  const directionalLight_z_up = new THREE.DirectionalLight(0xFFFFFF, 4);  // Luz más intensa desde arriba
  directionalLight_z_up.position.set(5, 5, 5);  // Aseguramos que la luz venga de arriba
  directionalLight_z_up.castShadow = true;
  scene.add(directionalLight_z_up);

  // Luz direccional ejes negativos
  const directionalLight_z_down = new THREE.DirectionalLight(0xFFFFFF, 3);  // Luz más intensa desde arriba
  directionalLight_z_down.position.set(-5, -5, -5);  // Aseguramos que la luz venga de arriba
  directionalLight_z_down.castShadow = true;
  scene.add(directionalLight_z_down);

  let loadedModels: THREE.Object3D[] = [];
  let selectedModel: THREE.Object3D | null = null;
  let isDragging = false;

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const offset = new THREE.Vector3();
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

  function loadModel(item: any) {
    if (item.format !== 'gltf' && item.format !== 'glb') {
      console.error('Only GLTF or GLB format is supported.');
      return;
    }

    // Check if the base64 string contains the 'data:' prefix and remove it if present
    let base64Decoded = item.octetStreamContent;
    const base64Prefix = 'data:application/octet-stream;base64,';

    // Remove the prefix if it exists
    if (base64Decoded.indexOf(base64Prefix) === 0) {
      base64Decoded = base64Decoded.substring(base64Prefix.length);
    }

    try {
      // Decode base64 string into binary
      const decoded = atob(base64Decoded); // Decode base64 to binary string
      const buffer = new ArrayBuffer(decoded.length);
      const view = new Uint8Array(buffer);

      // Copy the decoded data into the buffer
      for (let i = 0; i < decoded.length; i++) {
        view[i] = decoded.charCodeAt(i);
      }

      // Create a Blob from the buffer
      const blob = new Blob([buffer], { type: 'application/octet-stream' });

      // Generate a URL for the Blob
      const url = URL.createObjectURL(blob);

      // GLTF Loader
      const loader = new GLTFLoader();
      loader.load(url, (gltf) => {
        addModelToScene(gltf.scene);
        console.log('gltf: ', gltf.scene.uuid);
      });

      // Optionally, revoke the object URL after loading the model
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error decoding base64 string: ', error);
    }
  }

  function addModelToScene(model: THREE.Object3D) {
    // Calcular el Bounding Box del modelo
    const box = new THREE.Box3().setFromObject(model);
    const center = new THREE.Vector3();
    box.getCenter(center);

    // Ajustar la posición para que el centro del modelo esté en (0, 0, 0)
    model.position.sub(center);

    // Escalar el modelo para que sea **gigante**
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const scaleFactor = 80 / maxDim; // 🚀 Lo llevamos al límite 🚀
    model.scale.set(scaleFactor, scaleFactor, scaleFactor);
    model.position.set(0, 0, 0);

    // Agregar el modelo a la escena
    scene.add(model);
    loadedModels.push(model);

    // 🔹 Poner la cámara pegada al modelo 🔹
    const distance = maxDim * 0.1; // 🔥 EXTREMADAMENTE CERCA 🔥
    camera.position.set(0, 0, distance); // Directo en el eje Z
    camera.lookAt(0, 0, 0); // Apuntar al modelo
  }

  loadModel(modelItem)
  // projectDetails.value.modelCheckoutCartDataLocal.forEach(loadModel);

  const originalColors = new Map<THREE.Object3D, THREE.Color>(); // Guardar colores originales

  function selectAndDragModel(event: MouseEvent) {
    if (event.button !== 0) return; // Solo clic izquierdo

    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(loadedModels, true);

    if (intersects.length > 0) {
      // Restaurar el color del modelo previamente seleccionado
      if (selectedModel) {
        selectedModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            const material = mesh.material as THREE.MeshStandardMaterial;
            if (originalColors.has(mesh)) {
              material.color.copy(originalColors.get(mesh)!); // Restaurar color original
            }
          }
        });
      }

      selectedModel = intersects[0].object;
      console.log("Modelo seleccionado:", selectedModel);

      // Guardar el color original antes de cambiarlo
      selectedModel.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          const material = mesh.material as THREE.MeshStandardMaterial;

          if (!originalColors.has(mesh)) {
            originalColors.set(mesh, material.color.clone()); // Guardar el color original
          }

          material.color.set(0xffff00); // Cambiar a amarillo
        }
      });

      // Calcular la posición inicial del modelo
      const intersection = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, intersection);
      offset.copy(intersection).sub(selectedModel.position);

      isDragging = true;
      controls.enabled = false; // 🔴 Disable OrbitControls
    }

    projectDetails.value.dimentions[0].x = selectedModel?.scale.x
    projectDetails.value.dimentions[0].y = selectedModel?.scale.y
    projectDetails.value.dimentions[0].z = selectedModel?.scale.z

    projectDetails.value.name = selectedModel?.name
  }

  function moveModel(event: MouseEvent) {
    if (!isDragging || !selectedModel) return;

    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersection = new THREE.Vector3();

    if (raycaster.ray.intersectPlane(plane, intersection)) {
      selectedModel.position.copy(intersection.sub(offset));
    }
  }

  function releaseModel() {
    isDragging = false;
    controls.enabled = true; // ✅ Re-enable OrbitControls
  }

  renderer.domElement.addEventListener('mousedown', selectAndDragModel);
  renderer.domElement.addEventListener('mousemove', moveModel);
  renderer.domElement.addEventListener('mouseup', releaseModel);

  function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();
}

const triggerFileInput = () => {
  fileInput.value.click();
};

// getProjectById()

onMounted(() => {
  // initModels();
});
</script>

<template>
  <VRow>
    <VCol cols="12" md="8">
      <VCard>
        <VCardItem :title="projectDetails.title" class="pb-6">
          <template #subtitle>
            <!-- <div class="text-body-1">
              Cliente <span class="text-h6 d-inline-block">{{ projectDetails?.client }}</span>
            </div> -->
          </template>
          <template #append>
            <div class="d-flex gap-4 align-center">
              <VChip variant="tonal" color="info" size="small">
                {{ projectDetails.modelCheckoutCartDataLocal.length > 1 ?
                  'Formatos de los Modelos: ' :
                  'Formato del Modelo: ' }}
              </VChip>
              <VChip variant="tonal" size="small">
                <!-- {{[...new Set(projectDetails.modelCheckoutCartDataLocal.map(model =>
                  model.format.toUpperCase()))].join(", ")}} -->
                GLTF
              </VChip>
              <!-- <VIcon
                size="24"
                class="cursor-pointer"
                icon="tabler-share"
              />
              <VIcon
                size="24"
                class="cursor-pointer"
                icon="tabler-bookmarks"
              /> -->
            </div>
          </template>
        </VCardItem>
        <VCardText>
          <VCard flat border>
            <!-- <swiper-container id="swiperContainer" v-show="selectedElement === 'image'" class="mySwiper w-100 rounded"
              thumbs-swiper=".mySwiper2" loop="true" space-between="10" navigation="false" centered-slides="true"
              events-prefix="swiper-">
              <swiper-slide v-for="swiperImg in projectDetails?.images" :key="swiperImg.alt">
                <VImg v-if="selectedElement === 'image'" id="image-viewer" :src="swiperImg.imagePath" cover
                  class="swiper-img1" />
              </swiper-slide>
            </swiper-container> -->
            <div class="px-2 pt-2">
              <div id="model-viewer" class="w-100 rounded" style=" block-size: 600px;inline-size: 800px;"></div>
            </div>
            <!-- <swiper-container class="mySwiper2" loop="true" free-mode="false" events-prefix="swiper-"
              slides-per-view="4">
              <swiper-slide v-for="(swiperImg) in projectDetails?.images" :key="swiperImg.alt"
                @click="selectOption('image')">
                <VImg :src="swiperImg.imagePath" cover class="swiper-img2" />
              </swiper-slide>
            </swiper-container>

            <div style="display: flex; justify-content: end;">
              <VBtn @click="selectOption('model')">
                <div style="display: flex; gap: 10px;">
                  <VIcon icon="tabler-cube" size="20" />
                  Ver 3D
                </div>
              </VBtn>
            </div> -->

            <VCardText>
              <!-- <h5 class="text-h5 mb-4">
                📌 Acerca del Proyecto
              </h5>
              <p class="text-body-1">
                {{ projectDetails?.about }}
              </p> -->
              <div class="d-flex justify-space-between align-center">
                <div>
                  <VBtn variant="outlined" :loading="loadings" :disabled="loadings" color="secondary" class="ma-2"
                    @click="fileUploadMessage === 'Sube Tu Imagen' ? triggerFileInput() : reload()">
                    {{ fileUploadMessage }}
                    <VIcon end :icon="fileUploadIcon" />
                  </VBtn>

                  <VBtn variant="outlined" class="ma-2" @click="quote">
                    Cotizar Modelo
                  </VBtn>
                </div>

                <VBtn :loading="isDownloading" :disabled="isDownloading" variant="outlined" class="ma-2"
                  @click="download($event)">
                  Descargar
                  <VIcon end icon="tabler-download" />
                </VBtn>
              </div>

              <!-- Input de archivo oculto -->
              <input type="file" ref="fileInput" accept="image/*" @change="uploadImage" style="display: none;" />

              <canvas ref="canvas" style="display: none;"></canvas>

              <VDivider class="my-6" />

              <h5 class="text-h5 mb-4">
                Propiedades del Projecto
              </h5>
              <div class="d-flex gap-x-12 gap-y-5 flex-wrap">
                <div>
                  <VList class="card-list text-medium-emphasis">
                    <!-- <VListItem>
                      <template #prepend>
                        <VIcon icon="tabler-atom" size="20" />
                      </template>
                      <VListItemTitle>Materiales: {{ projectDetails?.materials }}</VListItemTitle>
                    </VListItem> -->
                    <VListItem>
                      <template #prepend>
                        <VIcon icon="tabler-cube" size="20" />
                      </template>
                      <VListItemTitle>Dimensiones: Altura: {{ projectDetails.dimentions[0].z }}mm, Ancho: {{
                        projectDetails?.dimentions[0].x }}mm, Profundidad: {{ projectDetails?.dimentions[0].y }}mm
                      </VListItemTitle>
                    </VListItem>
                    <VListItem>
                      <template #prepend>
                        <VIcon icon="tabler-photo" size="20" />
                      </template>
                      <VListItemTitle>Formato de su imagen: {{ fileUploadFormat }}
                      </VListItemTitle>
                    </VListItem>
                    <!-- <VListItem>
                      <template #prepend>
                        <VIcon icon="tabler-weight" size="20" />
                      </template>
                      <VListItemTitle>
                        Peso: {{ projectDetails?.weight >= 1000
                          ? (projectDetails.weight / 1000).toFixed(2) + ' KG'
                          : projectDetails.weight + ' G' }}
                      </VListItemTitle>
                    </VListItem> -->
                    <!-- <VListItem>
                      <template #prepend>
                        <VIcon
                          icon="tabler-file"
                          size="20"
                        />
                      </template>
                    </VListItem> -->
                  </VList>
                </div>

                <div>
                  <VList class="card-list text-medium-emphasis">
                    <!-- <VListItem>
                      <template #prepend>
                        <VIcon icon="tabler-number" size="20" />
                      </template>
                      <VListItemTitle>Numero de impresiones: {{ projectDetails?.totalPrints }}</VListItemTitle>
                    </VListItem> -->
                    <!-- <VListItem>
                      <template #prepend>
                        <VIcon icon="tabler-clock" size="20" />
                      </template>
                      <VListItemTitle>Tiempo Impresión: {{ projectDetails?.time }}</VListItemTitle>
                    </VListItem> -->
                  </VList>
                </div>
              </div>
              <!-- <VDivider class="my-6" /> -->

              <!-- <h5 class="text-h5 mb-4">
                📌 Descripción
              </h5> -->
              <!-- eslint-disable-next-line vue/no-v-html -->
              <!-- <div v-html="projectDetails?.description" /> -->

              <!-- <VDivider class="my-6" />

              <h5 class="text-h5 mb-4">
                Client
              </h5>
              <div class="d-flex align-center gap-x-4">
                <VAvatar
                  :image="projectDetails?.instructorAvatar"
                  size="38"
                />
                <div>
                  <h6 class="text-h6 mb-1">
                    {{ projectDetails?.client }}
                  </h6>
                  <div class="text-body-2">
                    {{ projectDetails?.instructorPosition }}
                  </div>
                </div>
              </div> -->
            </VCardText>
          </VCard>
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12" md="4">
      <div class="course-content">
        <VExpansionPanels v-model="panelStatus" variant="accordion" class="expansion-panels-width-border">
          <template v-for="(section, index) in instructions" :key="index">
            <VExpansionPanel elevation="0" :value="index" expand-icon="tabler-chevron-right"
              collapse-icon="tabler-chevron-down">
              <template #title>
                <div>
                  <h5 class="text-h5 mb-1">
                    {{ section.title }}
                  </h5>
                </div>
              </template>
              <template #text>
                <VList class="card-list">
                  <VListItem v-for="(topic, id) in section.topics" :key="id" class="py-4">
                    <!-- <template #prepend>
                      <VCheckbox
                        :model-value="topic.isCompleted"
                        class="me-1"
                      />
                    </template> -->
                    <VListItemTitle class="text-high-emphasis font-weight-medium">
                      {{ id + 1 }} . {{ topic.title }}
                      <VIcon size="24" :icon="topic.icon" />
                    </VListItemTitle>
                    <VListItemSubtitle>
                      <div class="text-body-2">
                        {{ topic.instruction1 }}
                      </div>
                    </VListItemSubtitle>
                    <VListItemSubtitle>
                      <div class="text-body-2">
                        {{ topic.instruction2 }}
                      </div>
                    </VListItemSubtitle>
                  </VListItem>
                </VList>
              </template>
            </VExpansionPanel>
          </template>
        </VExpansionPanels>
      </div>

      <VDivider class="my-6" />

      <VImg :src="fileContent" rounded="lg" />
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@layouts/styles/mixins" as layoutsMixins;

body .v-layout .v-application__wrap {
  .course-content {
    .v-expansion-panels {
      border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
      border-radius: 6px;

      .v-expansion-panel {
        &--active {
          .v-expansion-panel-title--active {
            border-block-end: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));

            .v-expansion-panel-title__overlay {
              opacity: var(--v-hover-opacity) !important;
            }
          }
        }

        .v-expansion-panel-title {
          .v-expansion-panel-title__overlay {
            background-color: rgba(var(--v-theme-on-surface));
            opacity: var(--v-hover-opacity) !important;
          }

          &:hover {
            .v-expansion-panel-title__overlay {
              opacity: var(--v-hover-opacity) !important;
            }
          }

          &__icon {
            .v-icon {
              block-size: 1.5rem !important;
              color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
              font-size: 1.5rem !important;
              inline-size: 1.5rem !important;

              @include layoutsMixins.rtl {
                transform: scaleX(-1);
              }
            }
          }
        }

        .v-expansion-panel-text {
          &__wrapper {
            padding-block: 1rem;
            padding-inline: 0.75rem;
          }
        }
      }
    }
  }

  .card-list {
    .v-list-item__prepend {
      .v-list-item__spacer {
        inline-size: 8px !important;
      }
    }
  }

  swiper-container {
    background-color: #fff;
  }

  .mySwiper2 {
    swiper-slide {
      border: 5px solid whitesmoke;
      block-size: 50%;
      inline-size: 25%;
      opacity: 0.4;
    }

    .swiper-slide-thumb-active {
      opacity: 1;
    }
  }

  .swiper-img1 {
    block-size: 360px;
    inline-size: 795px;
  }

  .swiper-img2 {
    block-size: 75px;
    inline-size: 275px;
  }

  .swiper-svg2 {
    block-size: 65px;
    inline-size: 265px;
    margin-inline-start: -40px;

    /* Mueve 20px a la izquierda */
  }
}
</style>
