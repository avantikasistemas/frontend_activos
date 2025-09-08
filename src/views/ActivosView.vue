<template>
    <div class="container mt-2">
        <div class="general-header">
            <div class="header-app-activos">
                <img :src="logotipo" :alt="logotipo" class="logo-app-activos" />
                <h3 class="titulo-app-activos">Gestión de Activos</h3>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-6">
                <div class="card p-4 mb-4">
                    <div class="detalle-activo-title">
                        <h5 class="mb-4">Detalles del Activo</h5>
                           <div v-if="retirado === 1" class="d-flex align-items-center gap-2">
                               <p class="mb-0">Activo retirado el día {{ fecha_retiro }}</p>
                               <button
                                   v-if="motivoRetiroMostrar"
                                   type="button"
                                   class="btn btn-tercero-link btn-motivo-retiro"
                                   :title="motivoRetiroMostrar"
                                   style="margin-left:4px;"
                               >
                                   <span class="icon-tercero-link">&#128203;</span>
                               </button>
                           </div>
                    </div>
                    <form>
                        <div class="row mb-4">
                            <div class="col-md-6">
                                <label class="form-label">Código</label>
                                <input type="text" class="form-control" v-model="codigo" @blur="buscarActivo" />
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Descripción</label>
                                <input type="text" class="form-control" v-model="descripcion" :readonly="retirado === 1"/>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Modelo</label>
                                <input type="text" class="form-control" v-model="modelo" :readonly="retirado === 1"/>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Serie</label>
                                <input type="text" class="form-control" v-model="serie" :readonly="retirado === 1"/>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Marca</label>
                                <input type="text" class="form-control" v-model="marca" :readonly="retirado === 1"/>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Estado</label>
                                <select class="form-select  " v-model="estado" :disabled="retirado === 1">
                                    <option value="">Seleccione</option>
                                    <option v-for="estado in listEstados" :key="estado.id" :value="estado.id">
                                        {{ estado.id }} - {{ estado.nombre }}
                                    </option>
                                </select>
                            </div>
                            <div class="col-md-12">
                                <label class="form-label">Características</label>
                                <textarea class="form-control" v-model="caracteristicas" :readonly="retirado === 1"></textarea>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Vida útil (meses)</label>
                                <input type="number" class="form-control" v-model="vidaUtil" :readonly="retirado === 1"/>
                            </div>
                            <div class="col-md-6 d-flex align-items-end">
                                <button type="submit" class="btn btn-danger w-100" @click.prevent="handleRetirar" :disabled="retirado === 1">Retirar</button>
                            </div>
                        </div>
                    </form>
                    <!-- Clasificación del documento aquí arriba -->
                    <div class="card p-3 mt-4">
                        <h5 class="mb-4">Clasificación del documento</h5>
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label class="form-label">Grupo Contable</label>
                                <select class="form-select" v-model="grupoContable" :disabled="retirado === 1">
                                    <option v-for="grupo in listGrupos" :key="grupo.id" :value="grupo.id">
                                        {{ grupo.id }} - {{ grupo.nombre }}
                                    </option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Macroproceso Encargado</label>
                                <select class="form-select" v-model="macroproceso_encargado" :disabled="retirado === 1">
                                    <option v-for="item in listMacroprocesosEncargados" :key="item.id" :value="item.id">
                                        {{ item.id }} - {{ item.nombre }}
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-6">
                <div class="card p-4 mb-4">
                    <h5 class="mb-4">Detalles de la compra</h5>
                    <div class="row mb-3">
                        <div class="col-md-12 position-relative">
                            <label class="form-label">Proveedor</label>
                            <input type="text" class="form-control" v-model="proveedorInput" @input="filtrarProveedores" @focus="showProveedorList = true" @blur="ocultarProveedorList" autocomplete="off" :readonly="retirado === 1"/>
                            <ul v-if="showProveedorList && proveedoresFiltrados.length" class="list-group position-absolute w-100" style="z-index:10; max-height:180px; overflow-y:auto;">
                                <li v-for="item in proveedoresFiltrados" :key="item.id" class="list-group-item list-group-item-action" @mousedown.prevent="seleccionarProveedor(item)">
                                    {{ item.id }} - {{ item.nombre }}
                                </li>
                            </ul>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Documento de compra</label>
                            <input type="text" class="form-control" v-model="documentoCompra" :readonly="retirado === 1"/>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Fecha de compra</label>
                            <input type="date" class="form-control" v-model="fechaCompra" :readonly="retirado === 1"/>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-md-12">
                            <label class="form-label">Costo de compra</label>
                            <input type="text" class="form-control" v-model="costoCompra" :readonly="retirado === 1" />
                        </div>
                    </div>
                </div>
                <div class="card p-4 mb-4">
                    <h5 class="mb-4">Tercero Asignado</h5>
                    <div class="row mb-3">
                        <div class="col-md-11 position-relative">
                            <label class="form-label">Tercero</label>
                            <input type="text" class="form-control" v-model="terceroInput" @input="filtrarTerceros" @focus="showTerceroList = true" @blur="ocultarTerceroList" autocomplete="off" :readonly="retirado === 1"/>
                            <ul v-if="showTerceroList && tercerosFiltrados.length" class="list-group position-absolute w-100" style="z-index:10; max-height:180px; overflow-y:auto;">
                                <li v-for="item in tercerosFiltrados" :key="item.id" class="list-group-item list-group-item-action" @mousedown.prevent="seleccionarTercero(item)">
                                    {{ item.id }} - {{ item.nombre }}
                                </li>
                            </ul>
                        </div>
                        <div class="col-md-1 d-flex align-items-end justify-content-center">
                            <button
                                type="button"
                                class="btn btn-primary btn-tercero-link"
                                :disabled="!tercero"
                                @click="abrirTerceroEnNuevaPestana"
                                title="Abrir tercero en nueva pestaña"
                            >
                                <span class="icon-tercero-link">&#128279;</span>
                            </button>
                        </div>
                        <div class="col-md-12 position-relative">
                            <label class="form-label">Macroproceso</label>
                            <select class="form-select" v-model="macroproceso" :disabled="retirado === 1">
                                <option v-for="item in listMacroprocesos" :key="item.id" :value="item.id">
                                    {{ item.id }} - {{ item.nombre }}
                                </option>
                            </select>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label class="form-label">Sede</label>
                            <select class="form-select" v-model="sede" :disabled="retirado === 1">
                                <option v-for="sede in listSedes" :key="sede.id" :value="sede.id">
                                    {{ sede.id }} - {{ sede.nombre }}
                                </option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Centro de costo</label>
                            <select name="centroCosto" id="centroCosto" class="form-select" v-model="centroCosto" :disabled="retirado === 1">
                                <option v-for="centro in listCentros" :key="centro.id" :value="centro.id">
                                    {{ centro.id }} - {{ centro.nombre }}
                                </option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-6">
                <div class="card p-4 mb-4">
                    <div class="d-flex gap-2">
                        <button
                          type="button"
                          :class="['btn', datos_activo ? 'btn-success' : 'btn-primary', 'btn-guardar-actualizar']"
                          :disabled="retirado === 1"
                          @click.prevent="guardarActualizarActivo"
                        >
                          {{ datos_activo ? 'Actualizar' : 'Guardar' }}
                        </button>
                        <button
                          type="button"
                          class="btn-historial"
                          @click.prevent="handleHistorial"
                        >
                          Historial
                        </button>
                        <button
                          type="button"
                          class="btn-limpiar"
                          :disabled="retirado === 1"
                          @click.prevent="limpiar"
                        >
                          Limpiar
                        </button>
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
                        <textarea class="form-control" v-model="motivoRetiro" rows="3" placeholder="Escribe el motivo..."></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-warning" @click="retirarActivo">Confirmar</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal de historial -->
    <div class="modal fade" id="historialModal" tabindex="-1" aria-labelledby="historialModalLabel" aria-hidden="true" data-bs-backdrop="static" ref="historialModal">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <div class="d-flex align-items-center w-100">
                        <span class="me-2" style="font-size:2.5rem;line-height:1;">&#8505;</span>
                        <h5 class="modal-title flex-grow-1" id="historialModalLabel" style="color: black;">Historial</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                </div>
                <div class="modal-body">
                    <div v-if="historial.length === 0" class="text-center text-muted py-4">
                        <p>No hay historial registrado para este activo.</p>
                    </div>
                    <div v-else>
                        <div class="table-responsive historial-scroll">
                            <table class="table table-sm mb-0" style="border:none;">
                                <thead class="bg-light historial-table">
                                    <tr>
                                        <th class="text-start" style="width:55%; border:none;">Descripción</th>
                                        <th class="text-center" style="width:25%; border:none;">Usuario</th>
                                        <th class="text-end" style="width:20%; border:none;">Fecha</th>
                                    </tr>
                                </thead>
                                <tbody class="historial-table">
                                    <tr v-for="(item, idx) in historial" :key="idx" class="historial-row">
                                        <td class="text-start align-middle" style="border:none; white-space:pre-line; word-break:break-word;">
                                            {{ item.descripcion }}
                                        </td>
                                        <td class="text-center align-middle" style="border:none;">
                                            {{ item.usuario }}
                                        </td>
                                        <td class="text-end align-middle" style="border:none;">
                                            <span class="badge bg-secondary">{{ item.created_at }}</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
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
import { useRouter } from 'vue-router';
import axios from 'axios';
import { Modal } from 'bootstrap';
import logotipo from '@/assets/logotipo.png';
import apiUrl from "../../config.js";

const datos_activo = ref(null);
const codigo = ref("");
const descripcion = ref("");
const modelo = ref("");
const serie = ref("");
const marca = ref("");
const estado = ref("");
const vidaUtil = ref("");
const proveedor = ref("");
const proveedorInput = ref("");
const proveedoresFiltrados = ref([]);
const showProveedorList = ref(false);
const retirado = ref(0);
const fecha_retiro = ref(null);

const tercero = ref("");
const terceroInput = ref("");
const tercerosFiltrados = ref([]);
const showTerceroList = ref(false);

const documentoCompra = ref("");
const fechaCompra = ref("");
const caracteristicas = ref("");
const sede = ref("");
const centroCosto = ref("");
const grupoContable = ref("");
const macroproceso = ref("");
const macroproceso_encargado = ref("");
const costoCompra = ref("");
const listMacroprocesos = ref([]);
const listMacroprocesosEncargados = ref([]);

const listEstados = ref([]);
const listSedes = ref([]);
const listCentros = ref([]);
const listGrupos = ref([]);
const listProveedores = ref([]);
const listTerceros = ref([]);

const msg = ref('');
const motivoRetiro = ref("");
const motivoRetiroMostrar = ref("");
const errorMsg = ref('');
const modalTitle = ref('');
const historial = ref([]);

const modalInstance = ref(null);
const modalErrorInstance = ref(null);
const modalPreguntaInstance = ref(null);
const modalHistorialInstance = ref(null);

const loading = ref(false);
const loading_msg = ref('');
const api_ruta = ref('');

const router = useRouter();

// Función para buscar un activo
const buscarActivo = async () => {
    if (!codigo.value) return;
    try {
        loading.value = true;
        loading_msg.value = 'Buscando...';

        const response = await axios.post(
            `${apiUrl}/consultar_activo`,
            { 
                codigo: codigo.value 
            },
            {
                headers: {
                    Accept: "application/json",
                }
            }
        );
        if (response.status === 200) {
            datos_activo.value = response.data.data || null;
            descripcion.value = datos_activo.value.descripcion || "";
            modelo.value = datos_activo.value.modelo || "";
            serie.value = datos_activo.value.serie || "";
            marca.value = datos_activo.value.marca || "";
            estado.value = datos_activo.value.estado || "";
            vidaUtil.value = datos_activo.value.vida_util || "";

            // Proveedor
            proveedor.value = datos_activo.value.proveedor || "";
            const proveedorObj = listProveedores.value.find(item => String(item.id) === String(proveedor.value));
            proveedorInput.value = proveedorObj ? `${proveedorObj.id} - ${proveedorObj.nombre}` : "";

            // Tercero
            tercero.value = datos_activo.value.tercero || "";
            const terceroObj = listTerceros.value.find(item => String(item.id) === String(tercero.value));
            terceroInput.value = terceroObj ? `${terceroObj.id} - ${terceroObj.nombre}` : "";

            documentoCompra.value = datos_activo.value.docto_compra || "";
            fechaCompra.value = datos_activo.value.fecha_compra || "";
            caracteristicas.value = datos_activo.value.caracteristicas || "";
            sede.value = datos_activo.value.sede || "";
            centroCosto.value = datos_activo.value.centro || "";
            grupoContable.value = datos_activo.value.grupo || "";
            macroproceso_encargado.value = datos_activo.value.macroproceso_encargado || "";
            macroproceso.value = datos_activo.value.macroproceso || "";
            costoCompra.value = datos_activo.value.costo_compra || "";
            retirado.value = datos_activo.value.retirado || "";
            fecha_retiro.value = datos_activo.value.fecha_retiro || null;
            motivoRetiroMostrar.value = datos_activo.value.motivo_retiro || "";
        }
    } catch (error) {
        console.error(error);
        modalErrorInstance.value.show();
        errorMsg.value = error.response.data.message;

        // Si no hay datos, limpiar los campos
        limpiar();
    } finally {
        loading.value = false;
    }
};

// Función para obtener los macroprocesos
const obtenerMacroprocesos = async () => {
    try {
        const response = await axios.post(
            `${apiUrl}/params/obtener_macroprocesos`, {},
            {
                headers: {
                    Accept: "application/json",
                }
            }
        );
        if (response.status === 200) {
            listMacroprocesos.value = response.data.data || [];
        }
    } catch (error) {
        console.error('Error al obtener macroprocesos:', error);
        modalErrorInstance.value.show();
        errorMsg.value = 'Error al cargar los macroprocesos.';
    }
};

// Función para obtener los estados
const obtenerEstados = async () => {
    try {
        const response = await axios.post(
            `${apiUrl}/params/obtener_estados`, {},
            {
                headers: {
                    Accept: "application/json",
                }
            }
        );
        if (response.status === 200) {
            listEstados.value = response.data.data || [];
        }
    } catch (error) {
        console.error('Error al obtener estados:', error);
        modalErrorInstance.value.show();
        errorMsg.value = 'Error al cargar los estados.';
    }
};

// Función para obtener las sedes
const obtenerSedes = async () => {
    try {
        const response = await axios.post(
            `${apiUrl}/params/obtener_sedes`, {},
            {
                headers: {
                    Accept: "application/json",
                }
            }
        );
        if (response.status === 200) {
            listSedes.value = response.data.data || [];
        }
    } catch (error) {
        console.error('Error al obtener sedes:', error);
        modalErrorInstance.value.show();
        errorMsg.value = 'Error al cargar las sedes.';
    }
};

// Función para obtener los centros
const obtenerCentros = async () => {
    try {
        const response = await axios.post(
            `${apiUrl}/params/obtener_centros`, {},
            {
                headers: {
                    Accept: "application/json",
                }
            }
        );
        if (response.status === 200) {
            listCentros.value = response.data.data || [];
        }
    } catch (error) {
        console.error('Error al obtener centros:', error);
        modalErrorInstance.value.show();
        errorMsg.value = 'Error al cargar los centros.';
    }
};

// Función para obtener los grupos
const obtenerGrupos = async () => {
    try {
        const response = await axios.post(
            `${apiUrl}/params/obtener_grupo_contable`, {},
            {
                headers: {
                    Accept: "application/json",
                }
            }
        );
        if (response.status === 200) {
            listGrupos.value = response.data.data || [];
        }
    } catch (error) {
        console.error('Error al obtener grupos:', error);
        modalErrorInstance.value.show();
        errorMsg.value = 'Error al cargar los grupos.';
    }
};

// Función para obtener los proveedores
const obtenerProveedores = async () => {
    try {
        const response = await axios.post(
            `${apiUrl}/params/obtener_proveedor`, {},
            {
                headers: {
                    Accept: "application/json",
                }
            }
        );
        if (response.status === 200) {
            listProveedores.value = response.data.data || [];
        }
    } catch (error) {
        console.error('Error al obtener proveedores:', error);
        modalErrorInstance.value.show();
        errorMsg.value = 'Error al cargar los proveedores.';
    }
};

// Función para obtener los terceros
const obtenerTerceros = async () => {
    try {
        const response = await axios.post(
            `${apiUrl}/params/obtener_tercero`, {},
            {
                headers: {
                    Accept: "application/json",
                }
            }
        );
        if (response.status === 200) {
            listTerceros.value = response.data.data || [];
        }
    } catch (error) {
        console.error('Error al obtener terceros:', error);
        modalErrorInstance.value.show();
        errorMsg.value = 'Error al cargar los terceros.';
    }
};

// Función para filtrar proveedores
const filtrarProveedores = () => {
    const texto = proveedorInput.value.trim().toLowerCase();
    if (!texto) {
        proveedoresFiltrados.value = listProveedores.value.slice(0, 20);
        return;
    }
    proveedoresFiltrados.value = listProveedores.value.filter(item =>
        item.nombre.toLowerCase().includes(texto) || String(item.id).toLowerCase().includes(texto)
    ).slice(0, 20);
};

// Función para seleccionar un proveedor
const seleccionarProveedor = (item) => {
    proveedor.value = item.id;
    proveedorInput.value = `${item.id} - ${item.nombre}`;
    showProveedorList.value = false;
};

// Función para ocultar la lista de proveedores
const ocultarProveedorList = () => {
    setTimeout(() => { showProveedorList.value = false; }, 150);
};

// Función para filtrar terceros
const filtrarTerceros = () => {
    const texto = terceroInput.value.trim().toLowerCase();
    if (!texto) {
        tercerosFiltrados.value = listTerceros.value.slice(0, 20);
        return;
    }
    tercerosFiltrados.value = listTerceros.value.filter(item =>
        item.nombre.toLowerCase().includes(texto) || String(item.id).toLowerCase().includes(texto)
    ).slice(0, 20);
};

// Función para seleccionar un tercero
const seleccionarTercero = (item) => {
    tercero.value = item.id;
    terceroInput.value = `${item.id} - ${item.nombre}`;
    showTerceroList.value = false;
};

// Función para ocultar la lista de terceros
const ocultarTerceroList = () => {
    setTimeout(() => { showTerceroList.value = false; }, 150);
};

// Función para abrir la página del tercero en una nueva pestaña
const abrirTerceroEnNuevaPestana = () => {
    if (!tercero.value) return;
    // Construye la ruta usando el nombre o path definido en el router
    const routeData = router.resolve({ name: 'Activotercero', params: { tercero: tercero.value } });
    window.open(routeData.href, '_blank');
};

// Función para limpiar los campos
const limpiar = () => {
    datos_activo.value = null;
    descripcion.value = "";
    modelo.value = "";
    serie.value = "";
    marca.value = "";
    estado.value = "";
    vidaUtil.value = "";
    proveedor.value = "";
    proveedorInput.value = "";
    tercero.value = "";
    terceroInput.value = "";
    documentoCompra.value = "";
    fechaCompra.value = "";
    caracteristicas.value = "";
    sede.value = "";
    centroCosto.value = "";
    grupoContable.value = "";
    macroproceso_encargado.value = "";
    macroproceso.value = "";
    costoCompra.value = "";
    retirado.value = 0;
};

// Función para manejar la acción de retirar
const handleRetirar = () => {
    if (!codigo.value) return;
    modalPreguntaInstance.value.show();
};

// Función para retirar un activo
const retirarActivo = async () => {
    if (!codigo.value || !motivoRetiro.value) return;
    try {
        loading.value = true;
        loading_msg.value = 'Buscando...';

        const response = await axios.post(
            `${apiUrl}/retirar_activo`,
            { 
                codigo: codigo.value,
                motivo: motivoRetiro.value
            },
            {
                headers: {
                    Accept: "application/json",
                }
            }
        );
        if (response.status === 200) {
            modalPreguntaInstance.value.hide();
            modalInstance.value.show();
            modalTitle.value = 'Éxito';
            msg.value = response.data.message;
            motivoRetiro.value = "";
            await buscarActivo();
        }
    } catch (error) {
        console.error(error);
        modalPreguntaInstance.value.hide();
        modalErrorInstance.value.show();
        errorMsg.value = error.response.data.message;
    } finally {
        loading.value = false;
    }
};

// Función para retirar un activo
const guardarActualizarActivo = async () => {
    if (!codigo.value) return;
    try {
        if (datos_activo.value) {
            api_ruta.value = 'actualizar_activo';
        } else {
            api_ruta.value = 'guardar_activo';
        }
        const response = await axios.post(
            `${apiUrl}/${api_ruta.value}`,
            { 
                codigo: codigo.value,
                descripcion: descripcion.value,
                modelo: modelo.value,
                serie: serie.value,
                marca: marca.value,
                estado: estado.value,
                vida_util: vidaUtil.value,
                proveedor: proveedor.value,
                tercero: tercero.value,
                docto_compra: documentoCompra.value,
                fecha_compra: fechaCompra.value,
                caracteristicas: caracteristicas.value,
                sede: sede.value,
                centro: centroCosto.value,
                grupo: grupoContable.value,
                macroproceso_encargado: macroproceso_encargado.value,
                macroproceso: macroproceso.value,
                costo_compra: costoCompra.value
            },
            {
                headers: {
                    Accept: "application/json",
                }
            }
        );

        if (response.status === 200) {
            modalInstance.value.show();
            modalTitle.value = 'Éxito';
            msg.value = response.data.message;
        }
    } catch (error) {
        console.error(error);
        modalErrorInstance.value.show();
        errorMsg.value = error.response.data.message;
    }
};

// Función para manejar la acción de historial
const handleHistorial = () => {
    if (!codigo.value) return;
    consultarHistorial();
    modalHistorialInstance.value.show();
};

// Función para consultar el historial de un activo
const consultarHistorial = async () => {

    try {
        const response = await axios.post(
            `${apiUrl}/consultar_historial`,
            { 
                codigo: codigo.value
            },
            {
                headers: {
                    Accept: "application/json",
                }
            }
        );

        if (response.status === 200) {
            historial.value = response.data.data;
        }
    } catch (error) {
        console.error(error);
        modalErrorInstance.value.show();
        errorMsg.value = error.response.data.message;
        historial.value = [];
    }
};

// Watcher para cargar macroprocesos encargados según grupo contable
watch(grupoContable, async (nuevoGrupo) => {
    if (!nuevoGrupo) {
        listMacroprocesosEncargados.value = [];
        macroproceso_encargado.value = "";
        return;
    }
    try {
        const response = await axios.post(
            `${apiUrl}/params/obtener_macroproceso_x_grupo`,
            { 
                grupo: nuevoGrupo 
            },
            {
                headers: {
                    Accept: "application/json",
                }
            }
        );
        if (response.status === 200) {
            listMacroprocesosEncargados.value = response.data.data || [];
            // macroproceso_encargado.value = "";
        }
    } catch (error) {
        console.error('Error al obtener macroprocesos encargados:', error);
        listMacroprocesosEncargados.value = [];
        macroproceso_encargado.value = "";
    }
});

// Código que se ejecuta al montar el componente
onMounted(() => {
  modalInstance.value = new Modal(exitoModal);
  modalErrorInstance.value = new Modal(errorModal);
  modalPreguntaInstance.value = new Modal(preguntaModal);
  modalHistorialInstance.value = new Modal(historialModal);

  obtenerEstados();
  obtenerMacroprocesos();
  obtenerSedes();
  obtenerCentros();
  obtenerGrupos();
  obtenerProveedores();
  obtenerTerceros();
  filtrarProveedores();
  filtrarTerceros();
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

.detalle-activo-title{
    display: flex;
    justify-content: space-between;
}

.detalle-activo-title p{
    color: red;
}

.btn-guardar-actualizar {
  min-width: 120px;
  font-weight: bold;
  transition: background 0.2s, color 0.2s;
}

.btn-historial {
  min-width: 120px;
  font-weight: bold;
  background-color: #d6d6d6;
  border: 0;
  border-radius: 6px;
  transition: background 0.2s, color 0.2s;
}

.btn-historial:hover {
  background-color: #a9a9a9;
  transition: background 0.2s, color 0.2s;
}

.btn-limpiar {
  min-width: 120px;
  font-weight: bold;
  background-color: #e75069;
  border: 0;
  border-radius: 6px;
  transition: background 0.2s, color 0.2s;
}

.btn-limpiar:hover {
  background-color: #c0392b;
  transition: background 0.2s, color 0.2s;
}

.historial-row td {
    border-bottom: 1.5px solid #e3e6ea !important;
}

.historial-table th,
.historial-table td {
    font-size: 0.88rem;
}

.historial-scroll {
    max-height: 340px;
    overflow-y: auto;
}

.btn-tercero-link {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 1.3rem;
    padding: 0;
    box-shadow: none;
}

.btn-motivo-retiro {
    background-color: #ffd3d3;
    border: none;
    color: #fff;
    transition: background 0.2s;
}
.btn-motivo-retiro:hover {
    background-color: #ff6666;
    color: #fff;
    cursor: help;
}

.icon-tercero-link {
    font-size: 1.3rem;
    line-height: 1;
}
</style>