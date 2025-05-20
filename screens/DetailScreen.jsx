import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  ActivityIndicator, 
  StyleSheet, 
  ScrollView,
  StatusBar,
  TouchableOpacity
} from 'react-native';

export default function DetailScreen({ route, navigation }) {
  const { postId } = route.params;
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`).then(res => res.json()),
      fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`).then(res => res.json())
    ])
    .then(([postData, commentData]) => {
      setPost(postData);
      setComments(commentData);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [postId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={styles.loadingText}>Chargement de l'article...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.postCard}>
          <View style={styles.postHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{post.title.charAt(0).toUpperCase()}</Text>
            </View>
            <Text style={styles.postId}>Article #{postId}</Text>
          </View>
          
          <Text style={styles.title}>{post.title}</Text>
          <Text style={styles.body}>{post.body}</Text>
        </View>

        <View style={styles.commentsSection}>
          <Text style={styles.commentTitle}>
            Commentaires <Text style={styles.commentCount}>({comments.length})</Text>
          </Text>
          
          {comments.map(comment => (
            <View key={comment.id} style={styles.comment}>
              <View style={styles.commentHeader}>
                <Text style={styles.commentAuthor}>{comment.name}</Text>
                <Text style={styles.commentEmail}>{comment.email}</Text>
              </View>
              <Text style={styles.commentBody}>{comment.body}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    margin: 16,
    marginBottom: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'space-between'
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  postId: {
    fontSize: 14,
    color: '#888',
    fontWeight: '500',
  },
  title: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 12,
    color: '#333',
    lineHeight: 28,
  },
  body: { 
    fontSize: 16, 
    marginBottom: 8,
    color: '#555',
    lineHeight: 24,
  },
  commentsSection: {
    padding: 16,
    paddingTop: 8,
  },
  commentTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 16,
    color: '#333',
  },
  commentCount: {
    color: '#888',
    fontWeight: 'normal',
  },
  comment: { 
    backgroundColor: '#FFFFFF', 
    padding: 16, 
    marginBottom: 12, 
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  commentHeader: {
    marginBottom: 8,
  },
  commentAuthor: { 
    fontWeight: 'bold',
    fontSize: 15,
    color: '#333',
    marginBottom: 2,
  },
  commentEmail: {
    fontSize: 13,
    color: '#888',
    marginBottom: 6,
  },
  commentBody: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
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