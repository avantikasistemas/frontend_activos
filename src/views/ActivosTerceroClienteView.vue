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
            <!-- <div class="col-lg-12">
                <div class="card p-4 mb-4">
                    <div class="row mb-4">
                        <h6>3. Observaciones Generales</h6>
                        <textarea class="form-control" rows="6"></textarea>
                    </div>
                </div>
            </div> -->
            <div class="col-lg-12">
                <div class="card p-4 mb-4">
                    <div class="row mb-4">
                        <h6>3. Firmas</h6>
                        <div class="firmas-acta-container">
                            <div class="firma-acta-block">
                                <!-- <input type="file" class="firma-acta-file" accept="image/*" />
                                <div class="firma-acta-line"></div>
                                <div class="firma-acta-label">Entrega</div> -->
                                <button type="button" class="btn btn-danger">Generar</button>
                            </div>
                            <!-- <div class="firma-acta-block">
                                <div class="firma-acta-line"></div>
                                <div class="firma-acta-label">Recibe</div>
                                <input type="file" class="firma-acta-file" accept="image/*" />
                            </div> -->
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

    <!-- Modal de pregunta -->
    <div class="modal fade" id="preguntaModal" tabindex="-1" aria-labelledby="preguntaModalLabel" aria-hidden="true" data-bs-backdrop="static" ref="preguntaModal">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header bg-warning text-white">
                    <div class="d-flex align-items-center w-100">
                        <span class="me-2" style="font-size:2.5rem;line-height:1;">&#9888;</span>
                        <h5 class="modal-title flex-grow-1" id="preguntaModalLabel" style="color: black;">Pregunta</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                </div>
                <div class="modal-body text-center">
                    <strong>¿Estás seguro de que deseas retirar el activo?</strong>
                    <div class="mt-3">
                        <textarea class="form-control" rows="3" placeholder="Escribe el motivo..."></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-warning" @click="retirarActivo">Confirmar</button>
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
const tercero = route.params.tercero;
const nombre = ref('');
const cargo = ref('');
const area = ref('');
const data_response = ref({});
const data_activos = ref([]);

const msg = ref('');
const errorMsg = ref('');
const modalTitle = ref('');

const modalInstance = ref(null);
const modalErrorInstance = ref(null);
const modalPreguntaInstance = ref(null);

const loading = ref(false);
const loading_msg = ref('');

// Función para consultar el historial de un activo
const consultarActivosXtercero = async () => {

    try {
        const response = await axios.post(
            `${apiUrl}/activos_x_tercero`,
            { 
                tercero: tercero
            },
            {
                headers: {
                    Accept: "application/json",
                }
            }
        );

        if (response.status === 200) {
            if (response.data.data && Object.keys(response.data.data).length > 0) {
                data_response.value = response.data.data;
                data_activos.value = data_response.value.activos || [];
                nombre.value = data_response.value.cabecera?.nombres || '';
                cargo.value = data_response.value.cabecera?.cargo || '';
                area.value = data_response.value.cabecera?.macroproceso_nombre || '';
            }
        }
    } catch (error) {
        console.error(error);
        modalErrorInstance.value.show();
        errorMsg.value = error.response.data.message;
    }
};


// Código que se ejecuta al montar el componente
onMounted(() => {
  modalInstance.value = new Modal(exitoModal);
  modalErrorInstance.value = new Modal(errorModal);
  modalPreguntaInstance.value = new Modal(preguntaModal);

  consultarActivosXtercero();


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