import { Loader } from '@/components/reusable'
import { Colors } from "@/constants/theme"
import { useMainContext } from "@/providers/MainProvider"
import { useUserContext } from "@/providers/UserProvider"
import { useChatMeta } from "@/services/chat/chat"
import { useSettings } from "@/services/settings/settings"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import React, { Fragment, useEffect, useState } from "react"
import { Share, StyleSheet, Text, TouchableOpacity, View } from "react-native"

interface IInfoCardProps {
   handleCancel: () => void
   type: "view" | "edit"
   setType: React.Dispatch<React.SetStateAction<"view" | "edit">>
   handleSubmit: () => void
   loading: boolean
}

export default function InfoCard( {
   handleCancel,
   setType,
   type,
   handleSubmit,
   loading,
}: IInfoCardProps ) {
   const { them } = useMainContext()
   const { user } = useUserContext()
   const meta = useChatMeta( user?.id )
   const { data: settings } = useSettings()
   const [ usedLocal, setUsedLocal ] = useState<number | undefined>( undefined )

   const color = Colors[ them ].text
   const invited = user?.invitedCount ?? 0
   const serverUsed = meta.data?.pages?.[ 0 ]?.messageCount ?? user?.totalMessagesUsed ?? 0
   const used = usedLocal ?? serverUsed
   const freeLimit = settings?.freeMessageLimit ?? 5
   const bonus = Math.floor( invited / 5 ) * 5
   const maxFree = freeLimit + bonus
   const remaining = Math.max( 0, maxFree - used )
   const isVip = user?.status === "vip"


   console.log( serverUsed )
   // console.log( serverUsed, 'serverUsed' )

   useEffect( () => {
      if ( typeof serverUsed === "number" ) {
         setUsedLocal( serverUsed )
      }
   }, [ serverUsed ] )

   const handleInvite = async () => {
      if ( !user?.referralCode ) return
      const appLink = `https://psychology-eosin.vercel.app/ref/${user.referralCode}`
      try {
         await Share.share( {
            message: `Nur Yolu - Psixoloji dəstək tətbiqi! Mənim dəvət kodumla qoşul və biz hər ikimiz bonus mesajlar qazanaq: ${appLink}`,
         } )
      } catch ( error ) {
         console.error( error )
      }
   }

   if ( !user ) return <Fragment />

   return (
      <View
         style={[ styles.profileCard, { backgroundColor: Colors[ them ].surface } ]}
      >
         <View style={styles.avatarSection}>
            <View
               style={[ styles.avatar, { backgroundColor: Colors[ them ].primary } ]}
            >
               <Text style={[ styles.avatarText, { color: Colors[ them ].background } ]}>
                  {user.name.charAt( 0 )}
                  {user.surname.charAt( 0 )}
               </Text>
            </View>
            <View style={styles.userInfo}>
               <Text style={[ styles.userName, { color } ]}>
                  {user.name} {user.surname}
               </Text>
               <Text style={[ styles.userEmail, { color: Colors[ them ].icon } ]}>
                  {user.email}
               </Text>
               <View style={styles.badges}>
                  <View
                     style={[
                        styles.badge,
                        {
                           backgroundColor: isVip ? `${Colors[ them ].primary}22` : `${Colors[ them ].warning}22`,
                           borderColor: isVip ? Colors[ them ].primary : Colors[ them ].warning,
                        },
                     ]}
                  >
                     <Ionicons
                        name={isVip ? "shield-checkmark" : "star-outline"}
                        size={14}
                        color={isVip ? Colors[ them ].primary : Colors[ them ].warning}
                     />
                     <Text
                        style={[
                           styles.badgeText,
                           { color: isVip ? Colors[ them ].primary : Colors[ them ].warning },
                        ]}
                     >
                        {isVip ? "VIP" : "Basic"}
                     </Text>
                  </View>
                  {!isVip && (
                     <View
                        style={[
                           styles.badge,
                           { backgroundColor: `${Colors[ them ].success}22`, borderColor: Colors[ them ].success },
                        ]}
                     >
                        <Ionicons name="chatbubble-ellipses-outline" size={14} color={Colors[ them ].success} />
                        <Text style={[ styles.badgeText, { color: Colors[ them ].success } ]}>
                           Qalıq: {remaining}
                        </Text>
                     </View>
                  )}
                  <View
                     style={[
                        styles.badge,
                        { backgroundColor: `${Colors[ them ].blue}22`, borderColor: Colors[ them ].blue },
                     ]}
                  >
                     <Ionicons name="people-outline" size={14} color={Colors[ them ].blue} />
                     <Text style={[ styles.badgeText, { color: Colors[ them ].blue } ]}>
                        Dəvətlər: {invited}
                     </Text>
                  </View>
               </View>
            </View>
         </View>

         <TouchableOpacity
            style={[
               styles.inviteButton,
               { backgroundColor: Colors[ them ].blue + '22', borderColor: Colors[ them ].blue },
            ]}
            onPress={handleInvite}
         >
            <Ionicons name="share-social" size={18} color={Colors[ them ].blue} />
            <Text style={[ styles.inviteButtonText, { color: Colors[ them ].blue } ]}>
               Dostlarını dəvət et
            </Text>
         </TouchableOpacity>

         <View style={styles.actionButtons}>
            {type === "view" ? (
               <TouchableOpacity
                  style={[
                     styles.editButton,
                     { backgroundColor: Colors[ them ].primary },
                  ]}
                  onPress={() => setType( "edit" )}
               >
                  <MaterialCommunityIcons
                     name="pencil"
                     size={20}
                     color={Colors[ them ].background}
                  />
                  <Text
                     style={[ styles.buttonText, { color: Colors[ them ].background } ]}
                  >
                     Düzəliş et
                  </Text>
               </TouchableOpacity>
            ) : (
               <View style={styles.editActions}>
                  <TouchableOpacity
                     style={[
                        styles.cancelButton,
                        {
                           borderColor: Colors[ them ].charcoal,
                        },
                     ]}
                     disabled={loading}
                     onPress={handleCancel}
                  >
                     <Text style={[ styles.cancelButtonText, { color } ]}>Ləğv et</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                     style={[
                        styles.saveButton,
                        { backgroundColor: Colors[ them ].success },
                     ]}
                     onPress={handleSubmit}
                     disabled={loading}
                  >
                     {loading ? (
                        <Loader color="white" size={20} />
                     ) : (
                        <Fragment>
                           <MaterialCommunityIcons
                              name="check"
                              size={20}
                              color={Colors[ them ].background}
                           />
                           <Text
                              style={[
                                 styles.buttonText,
                                 { color: Colors[ them ].background },
                              ]}
                           >
                              Saxla
                           </Text>
                        </Fragment>
                     )}
                  </TouchableOpacity>
               </View>
            )}
         </View>
      </View>
   )
}

const styles = StyleSheet.create( {
   profileCard: {
      padding: 20,
      borderRadius: 16,
      marginBottom: 20,
   },
   avatarSection: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
   },
   avatar: {
      width: 64,
      height: 64,
      borderRadius: 32,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
   },
   avatarText: {
      fontSize: 24,
      fontWeight: "bold",
   },
   userInfo: {
      flex: 1,
   },
   userName: {
      fontSize: 20,
      fontWeight: "600",
      marginBottom: 4,
   },
   userEmail: {
      fontSize: 16,
   },
   badges: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginTop: 8,
   },
   badge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 10,
      borderWidth: 1,
   },
   badgeText: {
      fontSize: 12,
      fontWeight: "700",
   },
   actionButtons: {
      marginTop: 10,
   },
   editButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
      borderRadius: 12,
      gap: 8,
   },
   editActions: {
      flexDirection: "row",
      gap: 12,
   },
   cancelButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
   },
   saveButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
      borderRadius: 12,
      gap: 8,
   },
   buttonText: {
      fontSize: 16,
      fontWeight: "600",
   },

   cancelButtonText: {
      fontSize: 16,
      fontWeight: "600",
   },
   inviteButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingVertical: 14,
      borderRadius: 12,
      marginTop: 12,
      borderWidth: 1,
   },
   inviteButtonText: {
      fontSize: 15,
      fontWeight: "600",
   },
} )
