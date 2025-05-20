import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet,
  StatusBar, Animated, Easing, Platform, Image
} from 'react-native';

export default function HomeScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const itemAnimations = useRef({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchRandomImage = () => {
    const width = 400;
    const height = 300;
    const categories = ['nature', 'technology', 'city', 'people', 'food'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    return `https://picsum.photos/seed/${randomCategory}-${Math.floor(Math.random() * 10000)}/${width}/${height}`;
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts');
      const data = await response.json();
      const limitedPosts = data.slice(0, 20).map(post => ({
        ...post,
        imageUrl: fetchRandomImage()
      }));
      setPosts(limitedPosts);
      setLoading(false);
      startAnimations(limitedPosts);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const startAnimations = (postList) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic)
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic)
      })
    ]).start();

    postList.forEach((item, index) => {
      const fadeAnim = new Animated.Value(0);
      const translateY = new Animated.Value(20);
      itemAnimations.current[item.id] = { fadeAnim, translateY };

      const delay = 100 + index * 80;
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          delay,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic)
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 500,
          delay,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic)
        })
      ]).start();
    });
  };

  const toggleFavorite = (id) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  };

  const renderItem = ({ item }) => {
    const animations = itemAnimations.current[item.id] || {};
    const { fadeAnim = new Animated.Value(1), translateY = new Animated.Value(0) } = animations;

    const isFavorite = favorites.includes(item.id);

    return (
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY }] }}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Detail', { postId: item.id })}
          activeOpacity={0.7}
        >
          <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.title.charAt(0).toUpperCase()}</Text>
              </View>
              <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
            </View>
            <Text style={styles.cardBody} numberOfLines={2}>{item.body}</Text>
            <View style={styles.cardFooter}>
              <View style={styles.cardMeta}>
                <Text style={styles.cardMetaText}>Article #{item.id}</Text>
              </View>
              <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
                <Text style={{ color: isFavorite ? '#FFD700' : '#FF6B6B', fontWeight: 'bold' }}>
                  {isFavorite ? '★ Favori' : '☆ Ajouter'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={styles.loadingText}>Chargement des articles...</Text>
      </View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
      ]}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onRefresh={fetchPosts}
        refreshing={loading}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    overflow: 'hidden',
    borderWidth: Platform.OS === 'ios' ? 0 : 0.5,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  cardImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#e1e4e8',
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  cardBody: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  cardMeta: {
    backgroundColor: 'rgba(0,0,0,0.03)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cardMetaText: {
    fontSize: 12,
    color: '#888',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  }
});
