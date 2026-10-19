import {StyleSheet,Text,View,TouchableOpacity,Image} from 'react-native';
import imagemCinema from "../../assets/images/tabIcons/cinema.jpg";
import { useRouter } from 'expo-router'; 

export default function HomeScreen() {
  const router = useRouter(); 

  return (
    <View style={styles.container}> 
      <View style={styles.content}>
        <Image source={imagemCinema} style={styles.imagePlaceholder} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>SENAIFLIX</Text>
          <Text style={styles.subtitle}>
            Filmes e séries ilimitados. Assista onde quiser.
          </Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={() => router.push('/catalogo')}
        >
          <Text style={styles.buttonText}>Entrar</Text>
          <Text style={styles.buttonArrow}>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  imagePlaceholder: {
    width: '100%',
    height: '63%',
    backgroundColor: '#EBEBEB',
    borderWidth: 2,
    borderColor: '#B0B0B0',
    borderRadius: 2,
  },
  textContainer: {
    marginVertical: 10,
  },
  title: {
    fontSize: 44,
    fontWeight: '900',
    color: '#E52312',
    letterSpacing: -1,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#111111',
    lineHeight: 26,
  },
  button: {
    backgroundColor: '#E52312',
    height: 56,
    borderRadius: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  buttonArrow: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '600',
  },
});