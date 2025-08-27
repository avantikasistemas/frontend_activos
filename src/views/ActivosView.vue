<template>
    <div class="header-app-activos">
        <img :src="logotipo" :alt="logotipo" class="logo-app-activos" />
        <h3 class="titulo-app-activos">App Activos</h3>
    </div>
    <div class="container mt-2">
        <div class="row">
            <div class="col-lg-6">
                <div class="card p-4 mb-4">
                    <h5 class="mb-4">Detalles del Activo</h5>
                    <form>
                        <div class="row mb-4">
                            <div class="col-md-6">
                                <label class="form-label">Código</label>
                                <input type="text" class="form-control" v-model="codigo" @blur="buscarActivo" />
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Descripción</label>
                                <input type="text" class="form-control" v-model="descripcion" />
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Modelo</label>
                                <input type="text" class="form-control" v-model="modelo" />
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Serie</label>
                                <input type="text" class="form-control" v-model="serie" />
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Marca</label>
                                <input type="text" class="form-control" v-model="marca" />
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Estado</label>
                                <select class="form-select  " v-model="estado">
                                    <option value="">Seleccione</option>
                                    <option v-for="estado in listEstados" :key="estado.id" :value="estado.id">
                                        {{ estado.id }} - {{ estado.nombre }}
                                    </option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Vida útil (meses)</label>
                                <input type="number" class="form-control" v-model="vidaUtil" />
                            </div>
                            <div class="col-md-6 d-flex align-items-end">
                                <button type="submit" class="btn btn-danger w-100" @click.prevent="handleRetirar">Retirar</button>
                            </div>
                        </div>
                    </form>
                    <!-- Clasificación del documento aquí arriba -->
                    <div class="card p-3 mt-4">
                        <h5 class="mb-4">Clasificación del documento</h5>
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label class="form-label">Grupo Contable</label>
                                <select class="form-select" v-model="grupoContable">
                                    <option v-for="grupo in listGrupos" :key="grupo.id" :value="grupo.id">
                                        {{ grupo.id }} - {{ grupo.nombre }}
                                    </option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Macroproceso</label>
                                <select class="form-select" v-model="macroproceso">
                                    <option v-for="item in listMacroprocesos" :key="item.id" :value="item.id">
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
                            <input type="text" class="form-control" v-model="proveedorInput" @input="filtrarProveedores" @focus="showProveedorList = true" @blur="ocultarProveedorList" autocomplete="off" />
                            <ul v-if="showProveedorList && proveedoresFiltrados.length" class="list-group position-absolute w-100" style="z-index:10; max-height:180px; overflow-y:auto;">
                                <li v-for="item in proveedoresFiltrados" :key="item.id" class="list-group-item list-group-item-action" @mousedown.prevent="seleccionarProveedor(item)">
                                    {{ item.id }} - {{ item.nombre }}
                                </li>
                            </ul>
                        </div>
                        <div class="col-md-12 position-relative">
                            <label class="form-label">Tercero</label>
                            <input type="text" class="form-control" v-model="terceroInput" @input="filtrarTerceros" @focus="showTerceroList = true" @blur="ocultarTerceroList" autocomplete="off" />
                            <ul v-if="showTerceroList && tercerosFiltrados.length" class="list-group position-absolute w-100" style="z-index:10; max-height:180px; overflow-y:auto;">
                                <li v-for="item in tercerosFiltrados" :key="item.id" class="list-group-item list-group-item-action" @mousedown.prevent="seleccionarTercero(item)">
                                    {{ item.id }} - {{ item.nombre }}
                                </li>
                            </ul>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Documento de compra</label>
                            <input type="text" class="form-control" v-model="documentoCompra"/>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Fecha de compra</label>
                            <input type="date" class="form-control" v-model="fechaCompra"/>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-md-12">
                            <label class="form-label">Características</label>
                            <textarea class="form-control" v-model="caracteristicas"></textarea>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label class="form-label">Sede</label>
                            <select class="form-select" v-model="sede">
                                <option v-for="sede in listSedes" :key="sede.id" :value="sede.id">
                                    {{ sede.id }} - {{ sede.nombre }}
                                </option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Centro de costo</label>
                            <select name="centroCosto" id="centroCosto" class="form-select" v-model="centroCosto">
                                <option v-for="centro in listCentros" :key="centro.id" :value="centro.id">
                                    {{ centro.id }} - {{ centro.nombre }}
                                </option>
                            </select>
                        </div>
                        <div class="col-md-12">
                            <label class="form-label">Costo de compra</label>
                            <input type="text" class="form-control" v-model="costoCompra" />
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

    <!-- Overlay de carga -->
    <div v-if="loading" class="loading-overlay">
        <div class="spinner-border text-light" role="status">
            <span class="visually-hidden"></span>
        </div>
        <p class="mt-2 text-light">{{ loading_msg }}</p>
    </div>
</template>

<script setup>

import { ref, onMounted } from 'vue';
// import LayoutView from '../views/Layouts/LayoutView.vue';
import axios from 'axios';
import { Modal } from 'bootstrap';
import logotipo from '@/assets/logotipo.png';
import apiUrl from "../../config.js";

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
const costoCompra = ref("");
const listMacroprocesos = ref([]);
const listEstados = ref([]);
const listSedes = ref([]);
const listCentros = ref([]);
const listGrupos = ref([]);
const listProveedores = ref([]);
const listTerceros = ref([]);

const msg = ref('');
const motivoRetiro = ref("");
const errorMsg = ref('');
const modalTitle = ref('');

const modalInstance = ref(null);
const modalErrorInstance = ref(null);
const modalPreguntaInstance = ref(null);

const loading = ref(false);
const loading_msg = ref('');

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
            descripcion.value = response.data.data.descripcion || "";
            modelo.value = response.data.data.modelo || "";
            serie.value = response.data.data.serie || "";
            marca.value = response.data.data.marca || "";
            estado.value = response.data.data.estado || "";
            vidaUtil.value = response.data.data.vida_util || "";

            // Proveedor
            proveedor.value = response.data.data.proveedor || "";
            const proveedorObj = listProveedores.value.find(item => String(item.id) === String(proveedor.value));
            proveedorInput.value = proveedorObj ? `${proveedorObj.id} - ${proveedorObj.nombre}` : "";

            // Tercero
            tercero.value = response.data.data.tercero || "";
            const terceroObj = listTerceros.value.find(item => String(item.id) === String(tercero.value));
            terceroInput.value = terceroObj ? `${terceroObj.id} - ${terceroObj.nombre}` : "";

            documentoCompra.value = response.data.data.docto_compra || "";
            fechaCompra.value = response.data.data.fecha_compra || "";
            caracteristicas.value = response.data.data.caracteristicas || "";
            sede.value = response.data.data.sede || "";
            centroCosto.value = response.data.data.centro || "";
            grupoContable.value = response.data.data.grupo || "";
            macroproceso.value = response.data.data.macroproceso || "";
            costoCompra.value = response.data.data.costo_compra || "";
        }
    } catch (error) {
        console.error(error);
        modalErrorInstance.value.show();
        errorMsg.value = error.response.data.message;

        // Si no hay datos, limpiar los campos
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
        macroproceso.value = "";
        costoCompra.value = "";
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

// Función para manejar la acción de retirar
const handleRetirar = () => {
    if (!codigo.value) return;
    modalPreguntaInstance.value.show();
}

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
        }
    } catch (error) {
        console.error(error);
        modalErrorInstance.value.show();
        errorMsg.value = error.response.data.message;
    } finally {
        loading.value = false;
    }
};

// Código que se ejecuta al montar el componente
onMounted(() => {
  modalInstance.value = new Modal(exitoModal);
  modalErrorInstance.value = new Modal(errorModal);
  modalPreguntaInstance.value = new Modal(preguntaModal);

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
</style>