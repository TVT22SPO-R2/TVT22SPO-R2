import React, { useState, useEffect } from "react";
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, FlatList, Modal } from "react-native";
import LocationMiniMap from "../components/LocationMiniMap";
import { useNavigation } from '@react-navigation/native';
import AddReviewModal from "../components/AddReviewModal";
import { firestore, collection, query, where, getDocs } from '../firebase/Config';
import { ScrollView } from 'react-native';
import shared5 from '../assets/shared5.jpg';

// Function to calculate the average rating
const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) return 0;
    
    const totalRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    return totalRating / reviews.length;
};

// Function to render the star ratings
const renderStarRatings = (averageRating) => {
    const filledStars = Math.floor(averageRating);
    const halfStar = averageRating - filledStars >= 0.5 ? 1 : 0;
    const emptyStars = 5 - filledStars - halfStar;

    const stars = [];
    for (let i = 0; i < filledStars; i++) {
        stars.push(<Text key={i}>&#9733;</Text>);
    }
    if (halfStar === 1) {
        stars.push(<Text key={'half'}>&#9734;</Text>);
    }
    for (let i = 0; i < emptyStars; i++) {
        stars.push(<Text key={i + filledStars + 1}>&#9734;</Text>);
    }

    return stars;
};

export default function ViewProduct({ route, navigation }) {
    const { product } = route.params;
    const [isAddReviewModalVisible, setIsAddReviewModalVisible] = useState(false);
    const [isCheckReviewsModalVisible, setIsCheckReviewsModalVisible] = useState(false);
    const [reviews, setReviews] = useState([]);

    const toggleAddReviewModal = () => {
        setIsAddReviewModalVisible(!isAddReviewModalVisible);
    };

    const toggleCheckReviewsModal = () => {
        setIsCheckReviewsModalVisible(!isCheckReviewsModalVisible);
    };

    const handleReviewSubmit = (reviewData) => {
        console.log('Review data:', reviewData);
        // Close the modal
        setIsAddReviewModalVisible(false);
    };

    const handleBooking = () => {
        navigation.navigate('CheckAvailability', { product: product })
    }

    const fetchReviewsBySpotId = async (spotId) => {
        try {
            const q = query(collection(firestore, 'Reviews'), where('spotId', '==', spotId));
            const querySnapshot = await getDocs(q);
            const fetchedReviews = [];
            querySnapshot.forEach((doc) => {
                fetchedReviews.push(doc.data());
            });
            setReviews(fetchedReviews);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    const handleCheckReviews = async () => {
        try {
            // Fetch reviews when the "Check Reviews" button is pressed
            await fetchReviewsBySpotId(product.id);
            // Open the modal to display reviews
            setIsCheckReviewsModalVisible(true);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    useEffect(() => {
        fetchReviewsBySpotId(product.id);
    }, [product.id]);

    const renderReviewItem = ({ item }) => (
        <View style={styles.reviewItem}>
            <Text>{item.comment}</Text>
            <Text>Rating: {item.rating}</Text>
        </View>
    );

    const averageRating = calculateAverageRating(reviews);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{product.address}</Text>
            <ImageBackground source={{ uri: product.images[0] }} style={styles.image}>
                <View style={styles.overlay}>
                    <Text style={styles.price}>{product.price}</Text>
                    <Text style={styles.description}>{product.description}</Text>
                </View>
            </ImageBackground>
            <LocationMiniMap coordinates={{ latitude: product.latitude, longitude: product.longitude }} />
            <TouchableOpacity
                style={styles.button}
                onPress={handleBooking}
            >
                <Text style={styles.buttonText}>Check availability & book now!</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={toggleAddReviewModal}>
                <Text style={styles.buttonText}>Add Review</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleCheckReviews}>
                <Text style={styles.buttonText}>Check Reviews</Text>
            </TouchableOpacity>

            <AddReviewModal
                isVisible={isAddReviewModalVisible}
                onClose={toggleAddReviewModal}
                onSubmit={handleReviewSubmit}
                product={product}
            />

            <Modal visible={isCheckReviewsModalVisible} animationType="slide">
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Reviews for {product.address}</Text>
                    <Text style={styles.averageRating}>
                        Average Rating: {averageRating.toFixed(1)} ({renderStarRatings(averageRating)})
                    </Text>
                    <FlatList
                        data={reviews}
                        renderItem={renderReviewItem}
                        keyExtractor={(item, index) => index.toString()}
                    />
                    <TouchableOpacity style={styles.closeButton} onPress={toggleCheckReviewsModal}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 350,
        height: 300,
        borderRadius: 10,
        overflow: 'hidden',
        marginVertical: 10,
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 0,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        marginVertical: 10,
    },
    price: {
        fontSize: 20,
        color: '#f9a620',
        textAlign: 'center',
    },
    description: {
        fontSize: 18,
        color: '#f9a620',
    },
    button: {
        marginVertical: 10,
        padding: 10,
        borderRadius: 5,
        width: 350,
        backgroundColor: '#a8d5e2',
        alignItems: 'center',
    },
    buttonText: {
        color: 'black',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    reviewItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    closeButton: {
        backgroundColor: '#a8d5e2',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    closeButtonText: {
        color: 'black',
        fontWeight: 'bold',
    },
    averageRating: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
});
