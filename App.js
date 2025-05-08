import React, { useState, useCallback, useEffect } from 'react';
import {View, Text, StyleSheet, SafeAreaView, StatusBar ,TextInput, FlatList , TouchableOpacity, Modal, AsyncStorage} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import Tasklist from './Tasklist';
import * as Animatable from 'react-native-animatable'; //import de animação

const AnimatedBt = Animatable.createAnimatableComponent(TouchableOpacity); 
//precisou disso para poder usar o animated pq ele so funciona em <View
export default function App () {
  const[task, setTask] = useState([ ]);
  const [open, SetOpen] = useState(false);
  const [input, setInput] = useState ('');

//buscando todas as tarefas ao iniciar o app
  useEffect(() => {
    async function loadTasks(){
      const taskStorage = await AsyncStorage.getItem('@task');

      if (taskStorage){
        setTask(JSON.parse(taskStorage));
      }
    }

    loadTasks();

  }, []);

//salvando caso tenha alguma tareafa alterada
  useEffect(() => {

    async function saveTasks(){
      await AsyncStorage.setItem('@task', JSON.stringify(task));
    }

    saveTasks();

  }, [task]);


  function handleAdd () {
    if(input == '') return;
    
    const data = {
      key: input,
      task: input
    };

    setTask([...task, data]);
    SetOpen(false);
    setInput('');
  }

  const handleDelete = useCallback((data) => {
    const find = task.filter( r => r.key !== data.key);
    setTask(find);
  })

  return(
    <SafeAreaView style={styles.container}> 
      <StatusBar backgroundColor= 'silver' barStyle="light-content" /> 

      <View> 
       <Text style={styles.title} > Minhas Tarefas </Text>
      </View>

     <FlatList
     marginHorizontal={10}
     showsHorizontalScrollIndicator={false}
     data={task}
     keyExtractor={(item) => String(item.key)}
     renderItem={({item}) => <Tasklist data={item} handleDelete={handleDelete}/>} />

     <Modal animationType='slide' transparent={false} visible={open}> 
      <SafeAreaView style={styles.modal}>

        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={ () => SetOpen(false) }>
            <Ionicons name= "return-up-back-outline" size={40} color="#9370DB" />
          </TouchableOpacity>
             <Text style={styles.modaltitle}> Nova Tarefa </Text>
        </View>

        <Animatable.View style={styles.modalBody} animation="fadeInUp" useNativeDriver> 
          <TextInput style={styles.input} multiline={true} placeholderTextColor="#747474" value={input} onChangeText={ (texto) => setInput (texto)}
          placeholder="O que precisa fazer hoje?"
          />

          <TouchableOpacity style={styles.handleAdd} onPress={handleAdd}>
            <Text style={styles.handleAddText}> Cadastrar </Text>
          </TouchableOpacity>
        </Animatable.View>

      </SafeAreaView>
     </Modal>

      <AnimatedBt style={styles.fab} useNativeDriver animation="bounceInUp" duration={1500} onPress={( ) => SetOpen(true)}> 
      <Ionicons style={{marginLeft:5,  marginRight:5}} name= "add-outline" size={35} color="#FFF" />
      
      </AnimatedBt>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    marginTop: 20,
    paddingBottom: 10,
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#9370DB', 
  },
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    backgroundColor: '#9370DB', 
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    right: 25,
    bottom: 25,
    elevation: 4,
    zIndex: 9,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 2, height: 4 },
  },
  modal: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalHeader: {
    marginLeft: 20,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  modaltitle: {
    marginLeft: 20,
    fontSize: 24,
    fontWeight: '600',
    color: '#4b0082',
  },
  modalBody: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
  input: {
    fontSize: 16,
    backgroundColor: '#f0f0f0',
    padding: 10,
    height: 90,
    textAlignVertical: 'top',
    color: '#333',
    borderRadius: 10,
  },
  handleAdd: {
    backgroundColor: '#9370DB',
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    borderRadius: 10,
  },
  handleAddText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  }
});
