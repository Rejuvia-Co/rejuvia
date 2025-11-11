
section desktop figma https://www.figma.com/design/Sp22vNhMpvPWh0SUqCyyZn/Rejuvia-Main?node-id=1656-13710&m=dev
section mibile figma https://www.figma.com/design/Sp22vNhMpvPWh0SUqCyyZn/Rejuvia-Main?node-id=1656-13660&m=dev

if 1 tip - https://www.figma.com/design/Sp22vNhMpvPWh0SUqCyyZn/Rejuvia-Main?node-id=1656-13760&m=dev

product's metafield custom.how_to_use - metaobject type 
Metaobject:
Title (single line text)
Subtitle(single line text)
steps (metaobjects list)

Metaobject step: 
Title step_title (single line text)
Description description (multi line text)
Image: file (image)
svg_icon (multi line text)
left_side_svg tru or false
first_tip_title (single line text)
first_tip_icon_svg (multi line text)
first_tip_description (multi line text)
second_tip_title (single line text)
second_tip_icon_svg (multi line text)
second_tip_description (multi line text)

- on step click open tab and close other
- hide section if steps (metaobjects list) blank


- design - the same as in figma
- use figma mcp 
if second_tip_title !blank - show 2 tips in row as https://www.figma.com/design/Sp22vNhMpvPWh0SUqCyyZn/Rejuvia-Main?node-id=1656-13710&m=dev

In section schema add infor that all content is availible for edition in product metafield 





7. **Pending Tasks:**
   - Implement responsive design improvements for 768-1200px breakpoint based on Playwright testing feedback

8. **Current Work:**
   Immediately before this summary request, I was testing the responsive design of the "How To Use" section using Playwright MCP at different screen widths (1000px, 900px, 800px) to evaluate 
the layout between 768-1200px. 

   After taking screenshots, I identified issues with the current medium screen implementation:
   - The 40% image width feels cramped, especially at 800px
   - The 1:1 aspect ratio makes portrait-oriented photos look awkward
   - There's underutilized white space in the layout
   
   I suggested improvements:
   1. Increase image width from 40% to 50%
   2. Change aspect ratio from 1:1 to 4:3 or 400/427
   3. Adjust padding for better breathing room
   4. Consider gap adjustments between image and steps



   FB Reviews section
   desktop figma - 