"use client";

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Error from './Error';
import type { DraftPatient, Patient } from '../types';
import { agregarPaciente, actualizarPaciente } from '../actions/pacientes';

type Props = {
    pacienteActivo: Patient | null;
};

const Formulario = ({ pacienteActivo }: Props) => {

    const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<DraftPatient>();

    useEffect(() => {
        if (pacienteActivo && typeof pacienteActivo === 'object') {
            setValue('name', pacienteActivo.name);
            setValue('caretaker', pacienteActivo.caretaker);
            setValue('email', pacienteActivo.email);
            setValue('date', pacienteActivo.date);
            setValue('symptoms', pacienteActivo.symptoms);
        }
    }, [pacienteActivo, setValue]);

    const registerPatient = async (data: DraftPatient) => {
        try {
            if (pacienteActivo) {
                await actualizarPaciente(pacienteActivo.id, data);
            } else {
                await agregarPaciente(data);
            }
            reset();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="md:w-1/2 lg:w-2/5 mx-5">
            <h2 className="font-black text-3xl text-center">Seguimiento Pacientes</h2>
            <p className="text-lg text-center mb-10">
                Añade Pacientes y {''}
                <span className="text-indigo-600 font-bold">Administralos</span>
            </p>

            <form 
                onSubmit={handleSubmit(registerPatient)}
                className="bg-white shadow-md rounded-lg py-10 px-5 mb-10"
                noValidate
            >
                <div className="mb-5">
                    <label htmlFor="name" className="text-sm uppercase font-bold text-gray-700">
                        Mascota
                    </label>
                    <input  
                        id="name"
                        className="w-full p-3 border border-gray-200 rounded-md"
                        type="text"
                        placeholder="Nombre de la Mascota"
                        {...register('name', { required: 'El nombre de la mascota es obligatorio' })}
                    />
                    {errors.name && <Error>{errors.name.message}</Error>}
                </div>

                <div className="mb-5">
                    <label htmlFor="caretaker" className="text-sm uppercase font-bold text-gray-700">
                        Propietario
                    </label>
                    <input  
                        id="caretaker"
                        className="w-full p-3 border border-gray-200 rounded-md"
                        type="text"
                        placeholder="Nombre del Propietario"
                        {...register('caretaker', { required: 'El propietario es obligatorio' })}
                    />
                    {errors.caretaker && <Error>{errors.caretaker.message}</Error>}
                </div>

                <div className="mb-5">
                    <label htmlFor="email" className="text-sm uppercase font-bold text-gray-700">
                        Email
                    </label>
                    <input  
                        id="email"
                        className="w-full p-3 border border-gray-200 rounded-md"
                        type="email"
                        placeholder="Email de Contacto"
                        {...register('email', { 
                            required: 'El Email es obligatorio',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Email no válido'
                            }
                        })}
                    />
                    {errors.email && <Error>{errors.email.message}</Error>}
                </div>

                <div className="mb-5">
                    <label htmlFor="date" className="text-sm uppercase font-bold text-gray-700">
                        Fecha Alta
                    </label>
                    <input  
                        id="date"
                        className="w-full p-3 border border-gray-200 rounded-md"
                        type="date"
                        {...register('date', { required: 'La fecha de alta es obligatoria' })}
                    />
                    {errors.date && <Error>{errors.date.message}</Error>}
                </div>

                <div className="mb-5">
                    <label htmlFor="symptoms" className="text-sm uppercase font-bold text-gray-700">
                        Síntomas
                    </label>
                    <textarea  
                        id="symptoms"
                        className="w-full p-3 border border-gray-200 rounded-md"
                        placeholder="Síntomas del paciente"
                        {...register('symptoms', { required: 'Los síntomas son obligatorios' })}
                    />
                    {errors.symptoms && <Error>{errors.symptoms.message}</Error>}
                </div>

                <input
                    type="submit"
                    className="bg-indigo-600 w-full p-3 text-white uppercase font-bold hover:bg-indigo-700 cursor-pointer transition-colors"
                    value={pacienteActivo ? 'Guardar Cambios' : 'Agregar Paciente'}
                />
            </form>
        </div>
    );
};

export default Formulario;