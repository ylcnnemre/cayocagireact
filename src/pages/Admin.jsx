// Admin.js
import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../AuthProvider'; // Kullanıcı durumunu kontrol etmek için oluşturduğunuz context
import { useNavigate } from 'react-router-dom';
import { Breadcrumb, Button, Col, Layout, Menu, Modal, Row, Spin, Table, theme } from 'antd';
import { signOut } from 'firebase/auth';
import { auth, db } from '../config';
import AddProduct from './AddProduct';
import styled from 'styled-components';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { toast } from 'react-toastify';
const { Header, Content, Footer } = Layout;

const Admin = () => {
    const [products, setProducts] = useState([]);
    const { currentUser, loading } = useAuthContext();
    const navigate = useNavigate();
    const [productLoading, setProductLoading] = useState()
    const [modalInfo, setModalInfo] = useState({
        visible: false,
        data: null,
        editMode: false
    })
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    console.log("currentuser", currentUser)
    useEffect(() => {
        if (!loading) {
            if (!currentUser) {
                navigate("/login")
            }

        }
        // Eğer kullanıcı giriş yapmamışsa, login sayfasına yönlendir
    }, [currentUser, loading]);

    const handleLogout = async () => {
        try {
            await signOut(auth); // Firebase çıkış işlemi
            navigate('/login'); // Çıkış yaptıktan sonra giriş sayfasına yönlendir
        } catch (error) {
            console.error("Çıkış hatası:", error);
        }
    };


    const fetchProducts = async () => {
        try {
            setProductLoading(true)
            const querySnapshot = await getDocs(collection(db, 'products'));
            const productsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setProducts(productsData);
        } catch (err) {

        } finally {
            setProductLoading(false)
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);


    const DeleteProduct = async (id) => {
        try {
            setProductLoading(true)
            const productRef = doc(db, 'products', id);
            await deleteDoc(productRef)
            toast.success("Ürün başarıyla silindi!", {
                position: "top-center",
                autoClose: 2500,
            });
            fetchProducts()
        }
        catch (err) {
            toast.error("Ürün silinirken bir hata oluştu!", {
                position: "top-center",
                autoClose: 1500,
            });
        }
        finally {
            setProductLoading(false)
        }
    }





    if (loading) {
        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh"
            }} >
                <Spin size='large' />
            </div>

        )
    }

    return (
        <Layout style={{
            height: "100vh"
        }}>
            <Header
                style={{
                    display: 'flex',
                    alignItems: 'center',
                }}
            >

                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['1']}
                    items={[
                        {
                            label: "Anasayfa",
                            key: "1"
                        }
                    ]}
                    style={{
                        flex: 1,
                        minWidth: 0,
                    }}
                />
                <Button type='primary' danger onClick={handleLogout} >
                    Çıkış
                </Button>
            </Header>
            <div style={{
                display: "flex",
                flex: 1,
                flexDirection: "column",
                padding: "50px"
            }}>
                <Row gutter={[{
                    md: 0
                }, {
                    md: 20

                }]} style={{
                    width: "100%"
                }} >
                    <Col md={24}>
                        <StyledHeader>
                            <Button type='primary' onClick={() => {
                                setModalInfo({
                                    visible: true,
                                    data: null
                                })
                            }} >
                                Ürün Ekle
                            </Button>

                        </StyledHeader>

                    </Col>
                    <Col md={24} >
                        <Table
                            scroll={{
                                x: 600
                            }}
                            pagination={{
                                pageSize: 5
                            }}
                            dataSource={products}
                            loading={productLoading}
                            columns={[
                                {
                                    title: "isim",
                                    render: (row, record) => {
                                        return (
                                            <p>
                                                {
                                                    record?.name
                                                }
                                            </p>
                                        )
                                    }
                                },
                                {
                                    title: "açıklama",
                                    render: (row, record) => {
                                        return (
                                            <p>
                                                {
                                                    record?.description
                                                }
                                            </p>
                                        )
                                    }
                                },
                                {
                                    title: "Fiyat",
                                    render: (row, record) => {
                                        return (
                                            <p>
                                                {record?.price} (TL)
                                            </p>
                                        )
                                    }
                                },
                                {
                                    title: "Fotoğraf",
                                    render: (row, record) => {
                                        console.log("recoxx", record)
                                        console.log("rexxxxPhoto", record?.photoURL)
                                        return (
                                            <img src={record?.photoURL} style={{
                                                width: "100px",
                                                height: "auto"
                                            }} alt="" />
                                        )
                                    }
                                },
                                {
                                    title: "İşlem",
                                    render: (row, record) => {
                                        return (
                                            <div style={{
                                                display: "flex",
                                                alignItems: "center",
                                                columnGap: "10px"
                                            }} >
                                                <Button type='primary' onClick={() => {
                                                    setModalInfo({
                                                        visible: true,
                                                        data: record,
                                                        editMode: true
                                                    })
                                                }} >
                                                    Güncelle
                                                </Button>
                                                <Button type='primary' danger onClick={() => {
                                                    Modal.confirm({
                                                        title: "Silmek istediğinize emin misiniz?",
                                                        cancelText: "İptal",
                                                        okText: "Eminim",
                                                        onOk: () => {
                                                            DeleteProduct(record?.id)
                                                        }
                                                    })
                                                }} >
                                                    Sil
                                                </Button>
                                            </div>
                                        )
                                    }
                                }
                            ]}
                        />
                    </Col>
                </Row>
            </div>


            <Footer
                style={{
                    textAlign: 'center',
                    backgroundColor: "#eee"
                }}
            >
                Ant Design ©{new Date().getFullYear()} Created by Ant UED
            </Footer>
            <AddProduct refreshMethod={() => {
                fetchProducts()
            }} modalInfo={modalInfo} setModalInfo={setModalInfo} loading={productLoading} setLoading={setProductLoading} />
        </Layout>
    );
};

export default Admin;


const StyledHeader = styled.div`
    display: flex;
    justify-content: flex-end;
    width: 100%;
    padding-bottom: 10px;
/*     border-bottom: 1px dashed gray; */

`