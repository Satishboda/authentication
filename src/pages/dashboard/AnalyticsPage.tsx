import React, { useState } from 'react';
import '../../styles/login.css'
type Props = {};

const AnalyticsPage = (props: Props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const handleLogin=(e:any)=>{
    e.preventDefault();
    console.log("inside the login method")
    console.log(username)
    console.log(password)


  }
  return (
    <div className="login-container">
    <h2>Login</h2>
    <form  onSubmit={handleLogin}>
      {error && <p className="error">{error}</p>}
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">Login</button>
    </form>
    <p >Creating a text with 20,000 words is quite extensive. For practical purposes, I can start the text here, and then you can continue generating more text as needed. Here's the beginning of a long narrative:

Once upon a time, in a land far, far away, there was a small village nestled in the heart of a vast and ancient forest. This village, named Eldoria, was unlike any other. It was a place where magic was woven into the very fabric of daily life, where the air was always thick with the scent of blooming flowers and the sound of laughter echoed through the cobblestone streets.

Eldoria was a village rich in history and tradition. It was said that the village had been founded by a group of wanderers who had stumbled upon a hidden grove in the forest, a place where the trees seemed to whisper secrets and the streams sparkled with a mysterious light. These wanderers, enchanted by the beauty and serenity of the grove, decided to settle there and build a community.

The founders of Eldoria were a diverse group of people, each bringing their own unique skills and talents to the village. There was Thalion, a skilled blacksmith whose craftsmanship was renowned throughout the land. His forge was always glowing, and the sound of his hammer striking metal was a constant rhythm that echoed through the village. Thalion's weapons and tools were not only functional but also works of art, with intricate designs and enchantments that made them highly sought after.

Then there was Elysande, a healer whose knowledge of herbs and potions was unmatched. Her small cottage, located on the edge of the village, was surrounded by a lush garden filled with plants and flowers of every kind. People from all over the region would come to seek her help, whether they were suffering from a simple cold or a more serious ailment. Elysande's remedies were always effective, and her gentle touch and kind words provided comfort to all who visited her.

In addition to Thalion and Elysande, there was also Aeliana, a weaver whose tapestries were said to be imbued with magic. Her loom, crafted from the wood of an ancient tree, was a marvel in itself, and her creations were breathtaking. Aeliana's tapestries depicted scenes from the village's history, capturing moments of joy and sorrow, triumph and defeat. They were more than just decorations; they were a record of the village's past, a way to preserve its stories for future generations.

As the years passed, Eldoria grew and prospered. The village became known as a place of peace and harmony, where people lived in harmony with nature and with each other. The villagers were a close-knit community, always ready to lend a hand to a neighbor in need. They celebrated together, mourned together, and faced challenges together, drawing strength from their shared bond.

One of the most cherished traditions in Eldoria was the Festival of Lights, held every year to mark the beginning of winter. The festival was a time of joy and celebration, a way to bring light and warmth to the darkest time of the year. The preparations for the festival began weeks in advance, with everyone in the village contributing in some way. Thalion would forge lanterns from metal, each one unique and beautifully crafted. Elysande would create special potions and remedies to keep everyone healthy during the cold months. Aeliana would weave new tapestries to decorate the village square, each one telling a story of hope and renewal.

On the night of the festival, the village would be transformed into a wonderland of light. Lanterns of every shape and size would be hung from trees, lining the streets, and floating on the streams. The air would be filled with the sound of music and laughter as people danced and sang, their faces glowing with happiness. It was a time for everyone to come together, to forget their worries and celebrate the beauty of life.

Among the many villagers who called Eldoria home was a young girl named Lyra. Lyra was the daughter of Thalion and Elysande, and she had inherited the talents of both her parents. She had her father's skill with metal and her mother's knowledge of herbs, and she often helped them in their work. But Lyra had a talent that was uniquely her own: she had a gift for magic.

From a young age, Lyra had shown an extraordinary ability to manipulate the elements. She could make flowers bloom with a touch, summon fire with a thought, and call forth rain with a whispered word. Her parents were both proud and protective of her, knowing that her gift was both a blessing and a burden. They taught her to use her magic wisely and responsibly, to never take it for granted or use it for selfish purposes.

Lyra was a curious and adventurous girl, always eager to explore the world around her. She loved to wander through the forest, discovering new plants and animals, and learning the secrets of the land. She was especially fascinated by the ancient grove where the village had been founded, a place that seemed to pulse with a mysterious energy. Lyra often went there to meditate and practice her magic, feeling a deep connection to the land and its history.

One day, while exploring the grove, Lyra came across something she had never seen before: a small, glowing stone, half-buried in the ground. The stone was warm to the touch, and it seemed to hum with a strange energy. Lyra felt a strange compulsion to take the stone with her, and she carefully dug it out of the ground and placed it in her pocket.

As she walked back to the village, Lyra couldn't shake the feeling that the stone was important, that it held some kind of power. She decided to show it to her parents, hoping they might know what it was. When she arrived home, Thalion and Elysande were both surprised and intrigued by the stone. Thalion examined it closely, marveling at its craftsmanship, while Elysande sensed a powerful magic emanating from it.

Together, they decided to take the stone to the village elder, a wise woman named Seraphina who had lived in Eldoria for as long as anyone could remember. Seraphina was known for her vast knowledge of magic and history, and she was often sought out for her wisdom and guidance. When Lyra, Thalion, and Elysande arrived at Seraphina's cottage, the elder greeted them warmly and listened intently as they explained how Lyra had found the stone.

Seraphina examined the stone closely, her eyes narrowing in concentration. After a few moments, she looked up and nodded slowly. "This is a very special stone," she said. "It is known as the Heartstone, and it is said to contain the essence of the ancient magic that flows through this land. It is a rare and powerful artifact, and it has been lost for many centuries."

Lyra's eyes widened in amazement. "What should we do with it?" she asked.

Seraphina smiled gently. "The Heartstone has chosen you, Lyra. It is now your responsibility to protect it and use its power wisely. The magic of the Heartstone can be a great force for good, but it must be used with care and respect. I will help you learn to harness its power and understand its secrets."

Over the next few months, Lyra spent many hours with Seraphina, learning about the Heartstone and practicing her magic. She discovered that the stone could amplify her abilities, allowing her to perform feats of magic that she had never thought possible. She also learned that the Heartstone was connected to the land itself, and that its power could be used to protect and heal the village.

One day, as Lyra was practicing her magic in the grove, she felt a strange disturbance in the air. The trees seemed to whisper anxiously, and the ground trembled beneath her feet. She knew that something was wrong, and she quickly made her way back to the village.

When she arrived, she found the villagers gathered in the square, their faces filled with fear and confusion. Thalion and Elysande were there, along with Seraphina, who looked more serious than Lyra had ever seen her.

"What's happening?" Lyra asked, her heart pounding.

Seraphina's eyes were filled with concern. "There is a great darkness approaching, a force of evil that seeks to consume the magic of this land. The Heartstone's power can protect us, but we must act quickly."

Lyra felt a surge of determination. She knew that she had been chosen to protect the Heartstone for a reason, and she was ready to face whatever challenges lay ahead. With Seraphina's guidance, she began to weave a powerful spell, drawing on the magic of the Heartstone and the strength of the land.

As she chanted the incantation, the air around her seemed to shimmer with energy, and a brilliant light began to emanate from the Heartstone. The villagers watched in awe as the light grew brighter and brighter, forming a protective barrier around the village.

The darkness that had been approaching was halted by the barrier, unable to penetrate its powerful magic. Lyra could feel the strain of maintaining the spell, but she drew strength from the land and from the people she loved. She knew that she could not falter, that she had to protect her home and her family.

Finally, with a final burst of energy, the darkness was pushed back, and the village was safe once more. The villagers erupted in cheers, their faces filled with relief and gratitude. Lyra felt a wave of exhaustion wash over her, but also a deep sense of accomplishment. She had faced the darkness and emerged victorious, and she knew that she had the strength and courage to protect her village, no matter what challenges lay ahead.

As the years passed, Lyra continued to grow in her magical abilities, always guided by the wisdom of Seraphina and the love of her parents. She became a guardian of the village</p>
  </div>
  );
};

export default AnalyticsPage;