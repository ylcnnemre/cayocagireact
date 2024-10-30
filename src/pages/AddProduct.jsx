import { Button, Col, Input, InputNumber, Modal, Row, Upload } from 'antd'
import React, { useEffect, useState } from 'react'
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config';
import { UploadOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { toast } from 'react-toastify';

const AddProduct = ({ modalInfo, setModalInfo, loading, setLoading, refreshMethod }) => {
    const [values, setValues] = useState({
        id: "",
        name: "",
        price: 0,
        description: "",
        photoURL: ""
    })
    const [file, setFile] = useState(null);
    const [fileList, setFileList] = useState([]); // fileList state'i ekliyoruz
    const resetValue = () => {
        setValues({
            name: "",
            price: 0,
            description: ""
        })
        setFile(null)
        setFileList([])
    }
    const validation = () => {
        if (values.name == "") {
            toast.error("İsim boş bırakılamaz", {
                position: "top-center",
                autoClose: 1500
            })
            return false
        }
        else if (values.description == "") {
            toast.error("Açıklama boş bırakılamaz", {
                position: "top-center",
                autoClose: 1500
            })
            return false
        }
        else if (values.price < 1) {
            toast.error("Fiyat 0 dan büyük olmalı", {
                position: "top-center",
                autoClose: 1500
            })
            return false
        }
        else if (file == null) {
            console.log("filedeee", file)
            toast.error("Fotoğraf seçiniz", {
                position: "top-center",
                autoClose: 1500
            })
            return false
        }
        return true
    }

    const updateValidation = () => {
        if (values.name == "") {
            toast.error("İsim boş bırakılamaz", {
                position: "top-center",
                autoClose: 1500
            })
            return false
        }
        else if (values.description == "") {
            toast.error("Açıklama boş bırakılamaz", {
                position: "top-center",
                autoClose: 1500
            })
            return false
        }
        else if (values.price < 1) {
            toast.error("Fiyat 0 dan büyük olmalı", {
                position: "top-center",
                autoClose: 1500
            })
            return false
        }
        return true
    }

    const onFinish = async () => {
        setLoading(true);
        try {

            // 1. Fotoğrafı Firebase Storage’a yükle
            if (modalInfo?.editMode) {
                const productRef = doc(db, 'products', modalInfo?.data?.id);
                if (updateValidation()) {
                    let updatePhotoUrl = ""
                    if (file != null) {
                        const storageRef = ref(storage, `products/${file.name}`);
                        await uploadBytes(storageRef, file);
                        updatePhotoUrl = await getDownloadURL(storageRef);

                        await updateDoc(productRef, {
                            name: values.name,
                            description: values.description,
                            price: values?.price,
                            photoURL: updatePhotoUrl
                        });
                        toast.success("Ürün başarıyla güncellendi!", {
                            position: "top-center",
                            autoClose: 2500,
                        });
                        setModalInfo({
                            visible: false,
                            editMode: false,
                            data: null
                        })
                        resetValue()
                        refreshMethod()
                    }
                    else {
                        await updateDoc(productRef, {
                            name: values.name,
                            price: values?.price,
                            description: values.description,
                        });
                        toast.success("Ürün başarıyla güncellendi!", {
                            position: "top-center",
                            autoClose: 2500,
                        });
                        setModalInfo({
                            visible: false,
                            editMode: false,
                            data: null
                        })
                        resetValue()
                        refreshMethod()
                    }
                }

            }
            else {
                if (validation()) {
                    const storageRef = ref(storage, `products/${file.name}`);
                    await uploadBytes(storageRef, file);
                    const photoURL = await getDownloadURL(storageRef);

                    // 2. Ürün bilgilerini Firestore’a kaydet
                    await addDoc(collection(db, 'products'), {
                        name: values.name,
                        price: values.price,
                        description: values.description,
                        photoURL,
                    });
                    toast.success("Ürün başarıyla eklendi", {
                        position: "top-center",
                        autoClose: 2500,
                    });
                    resetValue()
                    setModalInfo({
                        visible: false,
                        data: null,
                        editMode: false
                    })
                    setFile(null)
                    setFileList([])
                    refreshMethod()
                }
            }


        } catch (error) {
            console.log("errror", error)
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (file) => {

        setFile(file?.fileList[0]?.originFileObj);
        setFileList(file.fileList); // Yüklenen dosyaları fileList'e set ediyoruz
    };

    useEffect(() => {
        if (modalInfo?.editMode) {
            console.log("modalInxx", modalInfo)
            setValues(
                {
                    ...modalInfo.data
                }
            )
        }
    }, [modalInfo])

    return (
        <Modal open={modalInfo.visible} title={
            modalInfo?.editMode ? "Güncelle" : "Ürün Ekle"
        } onCancel={() => {
            setModalInfo({
                visible: false,
                data: null,
                editMode: false
            })
            resetValue()
            setFile(null)
        }}
            footer={() => {
                return (
                    <div style={{
                        display: "flex",
                        marginTop: "30px",
                        justifyContent: "space-between"
                    }} >
                        <Button type='primary' danger onClick={() => {
                            setModalInfo({
                                visible: false,
                                data: null,
                                editMode: false
                            })
                            resetValue()
                        }} >
                            İptal
                        </Button>
                        <Button type='primary' onClick={onFinish} loading={loading} >
                            {
                                modalInfo?.editMode ? "Güncelle" : "Kaydet"
                            }
                        </Button>

                    </div>
                )
            }}
        >
            <Row style={{
                width: "100%"
            }}
                gutter={[
                    {

                    }, {
                        md: 7
                    }
                ]}
            >
                <Col md={24} >
                    <p style={{
                        fontWeight: "bold",
                        margin: "5px 0"
                    }}>
                        İsim
                    </p>
                    <StyledInput value={values.name} placeholder='İsim' onChange={(e) => {
                        setValues({
                            ...values,
                            name: e.target.value
                        })
                    }} />
                </Col>
                <Col md={24} >
                    <p style={{
                        fontWeight: "bold",
                        margin: "5px 0"
                    }}>
                        Fiyat
                    </p>
                    <InputNumber value={values.price} placeholder='Fiyat' type='number' onChange={(e) => {

                        setValues({
                            ...values,
                            price: e
                        })
                    }} min={1} style={{
                        width: "100%"
                    }} />
                </Col>
                <Col md={24} >
                    <p style={{
                        fontWeight: "bold",
                        margin: "5px 0"
                    }}>
                        Açıklama
                    </p>
                    <Input.TextArea value={values.description} placeholder='Fiyat' type='number' onChange={(e) => {
                        setValues({
                            ...values,
                            description: e.target.value
                        })
                    }} min={1} style={{
                        width: "100%"
                    }} />
                </Col>
                <Col md={24} >
                    <p style={{
                        fontWeight: "bold",
                        margin: "5px 0"
                    }}>
                        Fotoğraf
                    </p>
                    <Upload
                        beforeUpload={() => false}
                        onChange={handleFileChange}
                        maxCount={1}
                        fileList={fileList}

                    >
                        <Button type='primary' icon={<UploadOutlined />}>Fotoğraf Yükle</Button>
                    </Upload>
                </Col>
                {
                    modalInfo?.editMode && (
                        <Col md={24}>
                            <p style={{
                                fontWeight: "bold",
                                margin: "10px 0 2px 0"
                            }}>
                                Mevcut Fotoğraf
                            </p>

                            <p style={{
                                margin: "5px 0",
                                fontWeight: "bolder",
                                cursor: "pointer"
                            }} onClick={() => {
                                window.open(values?.photoURL)
                            }} >
                                {
                                    values?.photoURL?.substring(0, 50)
                                }...
                            </p>

                        </Col>
                    )
                }
            </Row>

        </Modal>
    )
}

export default AddProduct

const StyledInput = styled(Input)`
    height: 35px;
`