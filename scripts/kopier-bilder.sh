#!/bin/bash
DEST="/Users/ulrikandresen/bolgevarsel-saas/public/images"

cp "$HOME/Downloads/Gemini_Generated_Image_381oca381oca381o.jpeg" "$DEST/familie-ny.jpg"
cp "$HOME/Downloads/Gemini_Generated_Image_g4jnxzg4jnxzg4jn.jpeg" "$DEST/baateier-ny.jpg"
cp "$HOME/Downloads/Gemini_Generated_Image_wrqu04wrqu04wrqu.jpeg" "$DEST/fisker-ny.jpg"
cp "$HOME/Downloads/Gemini_Generated_Image_kvchdakvchdakvch.jpeg" "$DEST/fridykker-ny.jpg"
cp "$HOME/Downloads/Gemini_Generated_Image_jhbomejhbomejhbo.jpeg" "$DEST/seiler-ny.jpg"
cp "$HOME/Downloads/Gemini_Generated_Image_cpw6rkcpw6rkcpw6.jpeg" "$DEST/kajakk-ny.jpg"
cp "$HOME/Downloads/Gemini_Generated_Image_xzcs2txzcs2txzcs.jpeg" "$DEST/surfer-ny.jpg"

echo "Bilder kopiert:"
ls "$DEST/" | grep ny

cd /Users/ulrikandresen/bolgevarsel-saas
git add -A && git commit -m "feat: nye Gemini-bilder for alle målgrupper" && git push
echo "Pushet!"
