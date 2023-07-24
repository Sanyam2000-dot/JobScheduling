import './App.css';
import {RadioGroup, Radio,Heading, defaultTheme, Provider,ActionButton, Button,ButtonGroup, Content, Dialog, DialogTrigger,DatePicker, Divider, Header, Text, Item, ComboBox, NumberField, Checkbox,CheckboxGroup} from '@adobe/react-spectrum'
import {parseZonedDateTime} from '@internationalized/date';
import  axios from 'axios';
import {React, useState, useEffect} from 'react'






function App() {
  let [selected, setSelected] = useState('');
  let [date, setDate] = useState(parseZonedDateTime('2023-07-23T00:45[Asia/Kolkata]'));
  let [upcomingJobs, setUpcomingJobs] = useState([])

  let [frequency, setFrequency] = useState('Daily')
  let [startDate, setStartDate] = useState(parseZonedDateTime('2023-07-23T00:45[Asia/Kolkata]'))
  let [repeatEvery, setRepeatEvery] = useState(0)
  let [daySelected, setDaySelected] = useState('Monday')
  let [endDate, setEndDate] = useState(parseZonedDateTime('2023-07-23T00:45[Asia/Kolkata]'))
  let [endDateBool, setEndDateBool] = useState(0)





  useEffect(() => {
  console.log('entered here')
  },[upcomingJobs]);
  
  const options = [ {id: 1, name: 'Daily'},
  {id: 2, name: 'Weekly'},
  {id: 3, name: 'Monthly'},]



  return (
    <Provider theme={defaultTheme}>
    <div className="App">
     <Heading level={4}>Job Scheduling</Heading>

    <DialogTrigger>  
        <ActionButton >Schedule Run</ActionButton>
      {(close) => (
        <Dialog>
          <Heading>Choose Run</Heading>
        
      
        <Content>

          <RadioGroup label="Job Run time"
          value={selected}
          onChange={setSelected} 
          >
            <Radio value="now">Run Now</Radio>
            <Radio value="later">Run Later</Radio>
          </RadioGroup>
            <div>
              {
                selected == "later"  ?
                <DatePicker
                value={date}
                onChange={setDate}
                label="Schedule Time"
                defaultValue={parseZonedDateTime('2023-07-23T00:45[Asia/Kolkata]')}
              /> : ""

              }
        
            </div>
        
        </Content>
          <ButtonGroup>
            <Button variant="secondary" onPress={close}>Cancel</Button>
            <Button variant="accent" onPress ={ async() => {return selected == 'now' ? await axios.get('http://localhost:3000/addToQueue')
            .then((response) => {
              console.log('reached',response);
              close()
            })
            .catch((error) => {
              console.log(error);
            }) :
            selected == 'later' ? 
          
            // console.log('target time', date?.toString())
            await axios.post('http://localhost:3000/addToQueueDelay',{targetTime :  date?.toString()})
            .then((response) => {
              console.log('upcoming', upcomingJobs.push({"Date" :date?.toString()}))
              // let tempArr = upcomingJobs.push(date?.toString())
              // console.log('temp arr', tempArr)
              // setUpcomingJobs(tempArr)
              console.log('pushed',response);
              close()
            })
            .catch((error) => {
              console.log(error);
            })
            :
            
            
            ""}}>
              Confirm
              </Button>
          </ButtonGroup>
        </Dialog>
          )}
    </DialogTrigger>
   


    <DialogTrigger>  
        <ActionButton >Schedule Periodic Run</ActionButton>
      {(close) => (
        <Dialog>
          <Heading>Choose Run</Heading>
        
      
        <Content>

        <ComboBox
        label="Select frequency"
        defaultItems={options}
        defaultInputValue={"Daily"}
        inputValue={frequency}
        onInputChange={setFrequency}>
        {item => <Item>{item.name}</Item>}
      </ComboBox>
            <div>
          
              <DatePicker
                value={startDate}
                onChange={setStartDate}
                label="Schedule Start Date"
                defaultValue={parseZonedDateTime('2023-07-23T00:45[Asia/Kolkata]')}
              /> 
        
            </div>

            <div>
            <NumberField
              label="Repeats Every"
              value={repeatEvery}
              onChange={setRepeatEvery}
              minValue={0} />
            </div>

            <div>
              <CheckboxGroup
                label=""
                value={daySelected}
                onChange={setDaySelected}
              >
                <Checkbox value="Sunday">Sunday</Checkbox>
                <Checkbox value="Monday">Monday</Checkbox>
                <Checkbox value="Tuesday">Tuesday</Checkbox>
                <Checkbox value="Wednesday">Wednesday</Checkbox>
                <Checkbox value="Thursday">Thursday</Checkbox>
                <Checkbox value="Friday">Friday</Checkbox>
                <Checkbox value="Saturday">Saturday</Checkbox>

              </CheckboxGroup>
            </div>
            <div>
            <RadioGroup label="Choose end date"
            
            value={endDateBool}
            onChange={setEndDateBool} 
            >
                <Radio value="0">No end date</Radio>
                <Radio value="1">

                <DatePicker
                value={endDate}
                onChange={setEndDate}
                label="Schedule end Date"
                defaultValue={parseZonedDateTime('2023-07-23T00:45[Asia/Kolkata]')}
              /> 

                </Radio>
              </RadioGroup>
            </div>
        
        </Content>
          <ButtonGroup>
            <Button variant="secondary" onPress={close}>Cancel</Button>
            <Button variant="accent" onPress ={ async() => {return  await axios.post('http://localhost:3000/addToQueueCrone',{
              frequency : frequency,
              startDate : startDate,
              repeatEvery : repeatEvery,
              daySelected : daySelected,
              endDate: endDate,
              endDateBool : endDateBool
            })
            .then((response) => {
              console.log('reached',response);
              close()
            })
            .catch((error) => {
              console.log(error);
            })   
            
            }}>
              Confirm
              </Button>
          </ButtonGroup>
        </Dialog>
          )}
    </DialogTrigger>
    </div>


    </Provider>



  );
}

export default App;
