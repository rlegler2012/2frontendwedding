import { useState } from 'react'
    
    const defaultFormState = {
        track: "",
        artist: "",
    }
    
    const MusicRequest = ({ tracks, setSongRequest }) => {
    
        const [musicForm, setMusicForm] = useState(defaultFormState)
    
        const handleChange = (e) => {
            setMusicForm(tempMusicForm => {
                return (
                    {
                        ...tempMusicForm,
                        [e.target.name]: e.target.value
                    }
                )
            })
            console.log(musicForm)
        }
    
        const handleSubmit = (e) => {
            e.preventDefault()
    
            setSongRequest(tempMusic => {
                return (
                    [
                        ...tempMusic,
                        musicForm
                    ]
                )
            })
    
            setMusicForm(defaultFormState)
        }
    
        return (
            <div className="form">
                <form onSubmit={handleSubmit}>
                    <label htmlFor="track">Song Name</label>
                    <input type="text" name="track" id="track" onChange={handleChange} value={musicForm.track} />
                    <label htmlFor="artist">Artist</label>
                    <input type="text" name="artist" id="artist" onChange={handleChange} value={musicForm.artist} />
    
                    <label htmlFor="submit"></label>
                    <input type="submit" value="Submit" name="submit" id="submit" />
                </form>
            </div>
        )
    }
    
export default MusicRequest;