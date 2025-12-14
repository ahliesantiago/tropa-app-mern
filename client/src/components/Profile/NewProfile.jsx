/*
 * This component will guide the new user to complete their profile.
 * The user will be brought to this page when they first sign-in
 * and will not be able to move past this page until they complete it.
 */

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  Button,
  ConfigProvider,
  Form,
  Input,
  Radio,
  Select,
  Switch
} from 'antd'
const { Option } = Select
const { TextArea } = Input

import '../../assets/styles/Auth.css'

const NewProfile = () => {
  const navigate = useNavigate()

  const [interestList, setInterestList] = useState([])
  const [nickname, setNickname] = useState('')
  const [gender, setGender] = useState('')
  const [location, setLocation] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [about, setAbout] = useState('')
  const [interests, setInterests] = useState('')
  const [pronouns, setPronouns] = useState('')
  const [beliefIsLgbtFriendly, setBeliefIsLgbtFriendly] = useState(false)
  const [isReligious, setIsReligious] = useState(false)
  const [beliefReligion, setBeliefReligion] = useState('')
  const [religionIsOther, setReligionIsOther] = useState(false)
  const [hasDietaryBeliefs, setHasDietaryBeliefs] = useState(false)
  const [beliefFood, setBeliefFood] = useState('')
  const [dietIsOther, setDietIsOther] = useState(false)
  const [hasPoliticalStance, setHasPoliticalStance] = useState(false)
  const [beliefPolitics, setBeliefPolitics] = useState('')
  const [stanceIsOther, setStanceIsOther] = useState(false)

  const fetchInterests = () => {
    axios.get('http://localhost:8080/interests')
    .then(response => {
      const interests = response.data.data
      const sortedInterests = interests.sort((a, b) => {
        if(a.interestName.toLowerCase() < b.interestName.toLowerCase()){
          return -1
        }
        if(a.interestName.toLowerCase() > b.interestName.toLowerCase()){
          return 1
        }
        return 0
      })
      setInterestList(sortedInterests.sort().map((interest) => {
        return {
          label: interest.interestName,
          value: interest._id
        }
      }))
    })
    .catch(error => {
      console.log(error)
    })
  }

  useEffect(() => {
    fetchInterests()
  }, [])

  const handleEditUser = (e) => {
    e.preventDefault()
    const username = localStorage.getItem('username')
    axios.get(`http://localhost:8080/users/${username}`)
      .then(response => {
        const fetchedUserId = response.data[0]._id
        return axios.put(`http://localhost:8080/users/${fetchedUserId}`, {
          nickname,
          gender,
          pronouns,
          location,
          phoneNumber,
          beliefIsLgbtFriendly,
          beliefFood,
          beliefReligion,
          beliefPolitics,
          about,
          interests,
        })
      })
      .then(response => {
        if(response.status === 200) {
          navigate(`/profile/${username}`)
        }
      })
      .catch(error => {
        console.log('Error updating user:', error)
        alert('Failed to update profile. Please try again.')
      })
  }

  const onFinish = (values) => {
    console.log('Success:', values)
  }
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  const handleChooseReligion = (e) => {
    if(e === 'Other') {
      if(beliefReligion !== '') { // Clear existing data, i.e. if a user selected a different option before choosing Other
        setBeliefReligion('')
      }
      setReligionIsOther(true)
    }else{
      setReligionIsOther(false)
      setBeliefReligion(e)
    }
  }

  const handleChooseDiet = (e) => {
    if(e === 'Other') {
      if(beliefFood !== '') { // Clear existing data, i.e. if a user selected a different option before choosing Other
        setBeliefFood('')
      }
      setDietIsOther(true)
    }else{
      setDietIsOther(false)
      setBeliefFood(e)
    }
  }

  const handleChooseStance = (e) => {
    if(e === 'Other') {
      if(beliefPolitics !== '') { // Clear existing data, i.e. if a user selected a different option before choosing Other
        setBeliefPolitics('')
      }
      setStanceIsOther(true)
    }else{
      setStanceIsOther(false)
      setBeliefPolitics(e)
    }
  }

  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Form: {
              itemMarginBottom: 10,
            },
          },
        }}
      >
        <h2 className="fs-3">Before you can start connecting, please complete your profile...</h2>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          labelWrap
          wrapperCol={{ span: 16 }}
          style={{
            maxWidth: 600,
          }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          labelAlign="left"
        >
          <Form.Item label="Nickname" name="nickname">
            <Input onChange={(e) => setNickname(e.target.value)} placeholder="What should we call you?" />
          </Form.Item>
          <Form.Item label="Gender" name="gender"
            rules={[{ required: true, message: "Please input your gender" }]}
          >
            <Select
              placeholder="Select how you identify"
              onChange={(e) => setGender(e)}
              allowClear
            >
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
              <Option value="Trans">Trans</Option>
              <Option value="Genderqueer">Genderqueer</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Pronouns" name="pronouns">
            <Select
              placeholder="Select your pronouns"
              onChange={(e) => setPronouns(e)}
              allowClear
            >
              <Option value="She/Her">She/Her</Option>
              <Option value="He/Him">He/Him</Option>
              <Option value="They/Them">They/Them</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Location" name="location">
            <Input
              placeholder="Where in the world are you?"
              onChange={(e) => setLocation(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Phone Number" name="phoneNumber">
            <Input
              placeholder="Provide your phone number for authentication purposes"
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="LGBT-friendly?"
            name="beliefIsLgbtFriendly"
            rules={[{ required: true, message: "For proper matching, please specify if you are LGBT-friendly" }]}
          >
            <Switch
              onChange={(e) => setBeliefIsLgbtFriendly(e)}
            />
          </Form.Item>
          <Form.Item label="Religious?" name="isReligious"
            rules={[{ required: true, message: "For proper matching, please specify if you are religious" }]}
          >
            <Radio.Group
              style={{ verticalAlign: 'middle' }}
              onChange={(e) => setIsReligious(e.target.value)}
              value={isReligious}
            >
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </Radio.Group>
            {isReligious && (
              <Form.Item
                name="beliefReligion"
                style={{ display: 'inline-block', width: '69%' }}
              >
                <Select
                  placeholder="Select your religion"
                  onChange={(e) => handleChooseReligion(e)}
                  allowClear
                >
                  <Option value="Buddhism">Buddhism</Option>
                  <Option value="Christianity">Christianity</Option>
                  <Option value="Hinduism">Hinduism</Option>
                  <Option value="Islam">Islam</Option>
                  <Option value="Judaism">Judaism</Option>
                  <Option value="Shinto">Shinto</Option>
                  <Option value="Sikhism">Sikhism</Option>
                  <Option value="Taoism">Taoism</Option>
                  <Option value="Other">Other</Option>
                </Select>
              </Form.Item>
            )}
            {religionIsOther && (
              <Form.Item>
                <Input
                  name="beliefReligion"
                  value={beliefReligion}
                  onChange={(e) => setBeliefReligion(e.target.value)}
                  placeholder='Enter your religion'
                />
              </Form.Item>
            )}
          </Form.Item>
          <Form.Item label="Any dietary beliefs?" name="hasDietaryBeliefs">
            <Radio.Group
              style={{ verticalAlign: 'middle' }}
              onChange={(e) => setHasDietaryBeliefs(e.target.value)}
              value={hasDietaryBeliefs}
            >
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </Radio.Group>
            {hasDietaryBeliefs && (
            <Form.Item
              name="beliefFood"
              style={{ display: 'inline-block', width: '69%' }}
            >
              <Select
                placeholder="Select your dietary philosophy"
                onChange={(e) => handleChooseDiet(e)}
                allowClear
              >
                <Option value="Flexitarian">Flexitarian</Option>
                <Option value="Fruitarian">Fruitarian</Option>
                <Option value="Kosher observer">Kosher observer</Option>
                <Option value="Pescatarian">Pescatarian</Option>
                <Option value="Pollotarian">Pollotarian</Option>
                <Option value="Vegan">Vegan</Option>
                <Option value="Vegetarian">Vegetarian</Option>
                <Option value="Other">Other</Option>
              </Select>
            </Form.Item>
            )}
            {dietIsOther && (
            <Form.Item>
              <Input
                name="beliefFood"
                value={beliefFood}
                onChange={(e) => setBeliefFood(e.target.value)}
                placeholder='Enter your dietary philosophy'
              />
            </Form.Item>
            )}
          </Form.Item>
          <Form.Item label="Any political inclinations?" name="hasPoliticalStance"
            rules={[{ required: true, message: "For proper matching, please specify if you have any relevant political beliefs" }]}
          >
            <Radio.Group
              style={{ verticalAlign: 'middle' }}
              onChange={(e) => setHasPoliticalStance(e.target.value)}
              value={hasPoliticalStance}
            >
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </Radio.Group>
            {hasPoliticalStance && (
            <Form.Item
              name="beliefPolitics"
              style={{ display: 'inline-block', width: '69%' }}
            >
              <Select
                placeholder="Select your political stance"
                onChange={(e) => handleChooseStance(e)}
                allowClear
              >
                <Option value="Apolitical">Apolitical</Option>
                <Option value="Conservative">Conservative</Option>
                <Option value="Democrat">Democrat</Option>
                <Option value="Fascist">Fascist</Option>
                <Option value="Liberal">Liberal</Option>
                <Option value="Republican">Republican</Option>
                <Option value="Other">Other</Option>
              </Select>
            </Form.Item>
            )}
            {stanceIsOther && (
              <Form.Item>
                <Input
                  name="beliefPolitics"
                  value={beliefPolitics}
                  onChange={(e) => setBeliefPolitics(e.target.value)}
                  placeholder='Enter your politics'
                />
              </Form.Item>
            )}
          </Form.Item>
          <Form.Item label="About" name="about">
            <TextArea
              rows={4}
              placeholder="Tell us something about yourself and why you're here, in 200 words or less..."
              onChange={(e) => setAbout(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Interests" name="interests"
            rules={[{ required: true, message: "For proper matching, please specify at least 3 interests" }]}
          >
            <Select
              mode="multiple"
              allowClear
              style={{ width: '100%' }}
              placeholder="Please select at least 3 interests"
              onChange={(e) => setInterests(e)}
              options={interestList}
            />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16, }}>
            <Button type="primary" htmlType="submit" onClick={handleEditUser}>Proceed</Button>
          </Form.Item>
        </Form>
      </ConfigProvider>
    </>
  )
}

export default NewProfile