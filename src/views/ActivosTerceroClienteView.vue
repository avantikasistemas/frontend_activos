<template>
    <div class="container mt-2">
        <div class="general-header">
            <div class="header-app-activos">
                <img :src="logotipo" :alt="logotipo" class="logo-app-activos" />
                <h3 class="titulo-app-activos">Gestión de Activos</h3>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-12">
                <div class="card p-4 mb-4">
                    <div class="detalle-activo-title">
                        <h5 class="mb-4">Acta de Entrega de Activos</h5>              
                    </div>
                    <div class="row mb-4">
                        <h6>1. Datos Generales</h6>
                        <div class="col-md-12">
                            <label class="form-label">Nombre Colaborador:</label>
                            <input type="text" class="form-control" v-model="nombre" readonly/>
                        </div>
                        <div class="col-md-12">
                            <label class="form-label">Cargo:</label>
                            <input type="text" class="form-control" v-model="cargo" readonly/>
                        </div>
                        <div class="col-md-12">
                            <label class="form-label">Area/Macroproceso</label>
                            <input type="text" class="form-control" v-model="area" readonly/>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-12">
                <div class="card p-4 mb-4">
                    <div class="row mb-4">
                        <h6>2. Activos Entregados</h6>
                        <div class="tabla-activos-tercero-scroll">
                          <table class="tabla-activos-tercero w-100">
                              <thead>
                                  <tr>
                                      <th>Código</th>
                                      <th>Descripción</th>
                                      <th>Marca</th>
                                      <th>Serial</th>
                                      <th>Estado</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  <tr v-for="(activo, index) in data_activos" :key="index">
                                      <td>{{ activo.codigo }}</td>
                                      <td>{{ activo.descripcion }}</td>
                                      <td>{{ activo.marca }}</td>
                                      <td>{{ activo.serie }}</td>
                                      <td>{{ activo.estado_nombre }}</td>
                                  </tr>
                              </tbody>
                          </table>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-12">
                <div class="card p-4 mb-4">
                    <div class="row mb-4">
                        <h6>3. Observaciones Generales</h6>
                        <textarea class="form-control" rows="2" v-model="observaciones" required :maxlength="300" :readonly="acta_firmada === 1"></textarea>
                    </div>
                </div>
            </div>
            <div class="col-lg-12">
                <div class="card p-4 mb-4">
                    <div class="row mb-4">
                        <h6>4. Firmas</h6>
                        <div class="firmas-acta-container">
                            <div class="firma-acta-block">
                                <div class="firma-acta-line"></div>
                                <div class="firma-acta-label">Recibe</div>
                                <input type="file" id="firma_tercero" class="firma-acta-file" accept="image/*" @change="handleImageChange($event)" required />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-12">
                <div class="card p-4 mb-4">
                    <div class="row mb-4">
                        <h6>5. Acciones</h6>
                        <div class="firmas-acta-container">
                            <div class="firma-acta-block-accion">
                                <div>
                                    <button type="button" class="btn btn-danger" @click="responderActa">Enviar</button>
                                </div>
                                <div v-if="acta_firmada === 1">
                                    <button type="button" class="btn btn-success" @click="">Descargar Acta</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>


    <!-- Modal de éxito -->
    <div class="modal fade" id="exitoModal" tabindex="-1" aria-labelledby="exitoModalLabel" aria-hidden="true" data-bs-backdrop="static" ref="exitoModal">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header bg-success text-white">
                    <div class="d-flex align-items-center w-100">
                        <span class="me-2" style="font-size:2.5rem;line-height:1;">&#10004;</span>
                        <h5 class="modal-title flex-grow-1" id="exitoModalLabel">{{ modalTitle }}</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                </div>
                <div class="modal-body text-success text-center">
                    <p>{{ msg }}</p>                    
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal de error -->
    <div class="modal fade" id="errorModal" tabindex="-1" aria-labelledby="errorModalLabel" aria-hidden="true" data-bs-backdrop="static" ref="errorModal">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header bg-danger text-white">
                    <div class="d-flex align-items-center w-100">
                        <span class="me-2" style="font-size:2.5rem;line-height:1;">&#10006;</span>
                        <h5 class="modal-title flex-grow-1" id="errorModalLabel">Error</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                </div>
                <div class="modal-body text-danger text-center">
                    <strong>{{ errorMsg }}</strong>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Overlay de carga -->
    <div v-if="loading" class="loading-overlay">
        <div class="spinner-border text-light" role="status">
            <span class="visually-hidden"></span>
        </div>
        <p class="mt-2 text-light">{{ loading_msg }}</p>
    </div>
</template>

<script setup>

import { ref, onMounted, watch } from 'vue';
// import LayoutView from '../views/Layouts/LayoutView.vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { Modal } from 'bootstrap';
import logotipo from '@/assets/logotipo.png';
import apiUrl from "../../config.js";

const route = useRoute();
const pdf_generado_id = route.params.id;

const nombre = ref('');
const cargo = ref('');
const area = ref('');
const archivo_ruta = ref('');
const data_response = ref({});
const data_activos = ref([]);
const payload = ref(null);
const observaciones = ref(null);
const firma_tercero = ref(null);
const acta_firmada = ref(0);

const msg = ref('');
const errorMsg = ref('');
const modalTitle = ref('');

const modalInstance = ref(null);
const modalErrorInstance = ref(null);

const loading = ref(false);
const loading_msg = ref('');

// Función para consultar el historial de un activo
const consultarDatosPdf = async () => {

    try {
        const response = await axios.post(
            `${apiUrl}/consultar_datos_pdf`,
            { 
                pdf_generado_id: parseInt(pdf_generado_id)
            },
            {
                headers: {
                    Accept: "application/json",
                }
            }
        );

        if (response.status === 200) {
            data_response.value = response.data.data;
            payload.value = JSON.parse(data_response.value.payload);
            
            nombre.value = payload.value.payload.cabecera.nombres;
            cargo.value = payload.value.payload.cabecera.cargo;
            area.value = payload.value.payload.cabecera.macroproceso_nombre;

            data_activos.value = payload.value.payload.activos;
            archivo_ruta.value = data_response.value.archivo_ruta;
        }
    } catch (error) {
        console.error(error);
        modalErrorInstance.value.show();
        errorMsg.value = error.response.data.message;
    }
};

// Función para responder el acta
const responderActa = async () => {

    try {
        const response = await axios.post(
            `${apiUrl}/responder_acta`,
            { 
                pdf_generado_id: parseInt(pdf_generado_id),
                observaciones: observaciones.value,
                firma_tercero: firma_tercero.value,
                archivo_ruta: archivo_ruta.value
            },
            {
                headers: {
                    Accept: "application/json",
                }
            }
        );

        if (response.status === 200) {
            // Crear una URL para el blob
            const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
            // Crear un enlace temporal para descargar el archivo
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `acta_final.pdf`);  // Definir el nombre del archivo
            document.body.appendChild(link);
            link.click();  // Ejecutar el click para descargar el archivo
            document.body.removeChild(link);  // Limpiar el DOM
        } else if (response.status === 210) {
            modalTitle.value = 'Éxito';
            msg.value = response.data.message;
            acta_firmada.value = 1;
            modalInstance.value.show();
        }
    } catch (error) {
        console.error(error);
        modalErrorInstance.value.show();
        errorMsg.value = error.response.data.message;
    }
};

const handleImageChange = async (event) => {
    const file = event.target.files[0]; // Obtenemos el archivo cargado
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            firma_tercero.value = reader.result; // Base64 de la imagen
        };
        reader.readAsDataURL(file);
    }
};


// Código que se ejecuta al montar el componente
onMounted(() => {
  modalInstance.value = new Modal(exitoModal);
  modalErrorInstance.value = new Modal(errorModal);

  consultarDatosPdf();
});

</script>

<style scoped>

.general-header {
    display: flex;
    justify-content: flex-start;
}

.header-app-activos {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-top: 2rem;
    margin-bottom: 1rem;
}

.logo-app-activos {
    height: 48px;
    width: auto;
    object-fit: contain;
}

.titulo-app-activos {
    margin-bottom: 0;
    font-weight: bold;
}

.container {
    max-width: 85vw;
    width: 98vw;
    margin: 0 auto;
}

/* Tabla de activos entregados - estilos modernos y fríos */
.tabla-activos-tercero-scroll {
    max-height: 320px;
    overflow-y: auto;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0,0,40,0.08);
}

.tabla-activos-tercero {
    border-collapse: separate;
    border-spacing: 0;
    background: linear-gradient(135deg, #e3f2fd 0%, #90caf9 100%);
    border-radius: 10px;
    overflow: hidden;
}
.tabla-activos-tercero th {
    background: linear-gradient(90deg, #64b5f6 0%, #1976d2 100%);
    color: #fff;
    font-weight: 600;
    text-align: center;
    padding: 12px 8px;
    font-size: 1rem;
    border-bottom: 2px solid #1976d2;
}
.tabla-activos-tercero td {
    text-align: center;
    padding: 10px 8px;
    font-size: 0.98rem;
    color: #1565c0;
    background: rgba(255,255,255,0.85);
    border-bottom: 1.5px solid #bbdefb;
}
.tabla-activos-tercero tr:last-child td {
    border-bottom: none;
}
.tabla-activos-tercero tbody tr:hover {
    background: #e3f2fd;
    transition: background 0.2s;
}

/* Firmas acta estilos */
.firmas-acta-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-top: 32px;
    margin-bottom: 8px;
}
.firma-acta-block {
    width: 32%;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.firma-acta-block-accion {
    width: 32%;
    display: flex;
    flex-direction: row;
    gap: 12px;
}
.firma-acta-line {
    width: 100%;
    height: 2px;
    background: #222;
    margin-bottom: 4px;
}
.firma-acta-label {
    font-size: 1.05rem;
    color: #222;
    margin-bottom: 2px;
}
.firma-acta-file {
    margin-top: 8px;
    width: 90%;
    max-width: 180px;
}
</style>