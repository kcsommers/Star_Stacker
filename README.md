# Project 1 - Star Stacker
**WDI Unit 1 Game Project**

With this project, I feel like I got my first glimpse at what its like to watch your code get away from you, and I learned a great deal from it. I decided to create this game, which is based on a game I used to love playing called Columns, knowing that it would be a challenge. In fact that is a big reason why I chose it - I thought it would be just the right amount of challenging to feel attainable but to really push me, and it turns out I got a little more than I bargained for. And while the game is far from perfect (there are plenty of bugs and glitches that I hope and plan to revisit as we progress through the course), I can safely say that I am happy with the results, and even more so with how much I learned about myself as a coder. 

## Getting Started
### Planning?
I did my best to plan ahead by writing down every function I thought I would need and drawing a few wire frames on paper - and from there my notes and plans got chaotic. It seems my process at this point is to draw some random graph or write down any random thought as it occurs to me along the way, without context or a way to understand it later. Something I definitely need to improve on. And while I found as I trudged along that I was usually able to go on trudging, by midweek I started to realize I could have used a better plan.

I decided to use canvas for the main board, and had to watch a few tutorials to feel more comfortable with it. I considered creating each piece as a DOM element, but thought I could add better animation with canvas once the game logic was pieced together. Unfortunately that took a little longer than expected. 

I began with drawing the main grid and setting an interval to drop each stack from the top of the screen, tracking its position along the way using the x and y coordinates of the grid lines. Then I had to make it stop. Then they had to stack. This was done by creating an array of objects representing each column of the grid, each with a ‘bottom’ property of 650, (the bottom of the grid). When a stack landed, the bottom of its current column would be updated, and the next stack would know where it had to stop. This array of column objects is also what I used to store each gems location - and knowing its location allowed me to check for matches once they landed.


### Game Logic
The check matches function is by far the most cumbersome and took a lot of writing and revisiting. Originally I used while loops to search for as many matches as possible, but after a lot of debugging and time on Classroom 1’s Airplay, came to the conclusion that they were a little too troublesome. I was spending way too much time force quitting and restarting the browser. But IF statements allowed me to check for a match of three without the potential for infinite loops, and over time I hope to go back to it and finish writing the logic to check for matches of more than three. 

The most difficult aspect off the game to write, the part that took me all of the second half of the week, was grabbing every gem above the disappeared ones and getting them to fall to the appropriate positions and check for matches again. Its where I started to feel frazzled, and where I started to feel completely wrapped up in it. It seemed so simple - I had the right gems and I had the right distances - I just had to make them stop falling. But this is where most of the bugs come in to play. Whenever a match occurs, I am essentially collecting every gem above in an array and assigning them their own interval to animate downward. With so many intervals setting and clearing, I feel like one must occasionally slip through the cracks, and send its gem flying off the canvas. They also create substantial lag time, and eventually the new stacks land before the hanging gems settle in to their new positions. 

Bugs aside, I finally decided the logic could pass as MVP and took the weekend to style the game. I also needed it to switch turns and declare a winner, and hopefully do a little more debugging if there was time. I utilized some of what I learned about canvas in the tutorials I watched to make the background of stars, and threw in some jQuery UI for the intro. 


## In Conclusion...
As frustrating as it was at times, I had a great time with this project. I skipped a few lunches and lost a few hours of sleep over it, but I think I’ve grown a little as a coder.  I can’t say for sure that games will be my first choice in the future, but I’m glad I chose a project that engaged me more than anything else I’ve ever worked on. 

It is still a work in progress, and I hope I'll have time soon to go back and work out the kinks. I'd also like to be able to check for matches of more than three, maybe have a one player mode with levels of increasing difficulty, and of course try to make it more responsive and mobile friendly. 

## Technologies
- HTML
- CSS
- JavaScript
- jQuery
- jQuery UI

## Sources
- [Chris Courses](https://www.youtube.com/channel/UC9Yp2yz6-pwhQuPlIDV_mjA)
- Google Fonts
- CodePen
- Kyle and Steven (Thank you!)
